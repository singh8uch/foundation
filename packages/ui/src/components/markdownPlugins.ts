import { code } from '@streamdown/code'
import { math } from '@streamdown/math'
import { useEffect, useState } from 'react'
import type { PluginConfig } from 'streamdown'

// Mermaid inlines resolved colors into its SVG, so it cannot follow the
// --theme-* tokens; pick its theme from the host scheme at first diagram
// render (the same color-scheme signal light-dark() uses).
function schemeIsDark(): boolean {
  if (typeof document === 'undefined') {
    return false
  }
  const scheme = getComputedStyle(document.documentElement).colorScheme
  if (scheme.includes('dark') !== scheme.includes('light')) {
    return scheme.includes('dark')
  }
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
}

const basePlugins: PluginConfig = {
  code,
  math: math as NonNullable<PluginConfig['math']>,
}

// @streamdown/mermaid statically imports mermaid (megabytes), so it loads on
// demand — only when the markdown actually contains a mermaid fence — and the
// plugin set upgrades in place once ready.
let pluginsWithMermaid: PluginConfig | undefined
let mermaidLoad: Promise<void> | undefined

function loadMermaid(): Promise<void> {
  mermaidLoad ??= import('@streamdown/mermaid').then(({ createMermaidPlugin }) => {
    const base = createMermaidPlugin()
    pluginsWithMermaid = {
      ...basePlugins,
      mermaid: {
        ...base,
        getMermaid: (config?: Parameters<typeof base.getMermaid>[0]) =>
          base.getMermaid({
            theme: schemeIsDark() ? 'dark' : 'neutral',
            ...config,
          }),
      },
    }
  })
  return mermaidLoad
}

export function useMarkdownPlugins(markdown: string, mermaid: boolean): PluginConfig {
  const needsMermaid = mermaid && !!markdown && markdown.includes('```mermaid')
  const [, setMermaidReady] = useState(() => !!pluginsWithMermaid)
  useEffect(() => {
    if (!needsMermaid || pluginsWithMermaid) {
      return
    }
    let live = true
    loadMermaid().then(() => {
      if (live) {
        setMermaidReady(true)
      }
    })
    return () => {
      live = false
    }
  }, [needsMermaid])
  return needsMermaid && pluginsWithMermaid ? pluginsWithMermaid : basePlugins
}
