import cx from 'classnames'
import { type BundledTheme, defaultRehypePlugins, Streamdown } from 'streamdown'
import { rehypeHttpsImagesOnly } from './httpsImages'
import type { MarkdownProps } from './Markdown'
import { useMarkdownPlugins } from './markdownPlugins'

const shikiTheme: [BundledTheme, BundledTheme] = ['github-light', 'github-dark']

const httpsImagesRehypePlugins = Object.entries(defaultRehypePlugins).flatMap(([name, plugin]) =>
  name === 'harden' ? [rehypeHttpsImagesOnly, plugin] : [plugin],
)

export default function Markdown({
  children,
  isStreaming,
  controls,
  mermaid,
  httpsImagesOnly,
}: MarkdownProps) {
  const plugins = useMarkdownPlugins(children, !!mermaid)
  return (
    <div className="markdown whitespace-normal text-start w-full">
      <Streamdown
        mode={isStreaming ? 'streaming' : 'static'}
        isAnimating={isStreaming ?? false}
        {...(isStreaming ? { caret: 'block' as const } : {})}
        {...(controls ? { controls } : {})}
        {...(httpsImagesOnly ? { rehypePlugins: httpsImagesRehypePlugins } : {})}
        plugins={plugins}
        shikiTheme={shikiTheme}
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              className={cx('link wrap-break-word', props.className)}
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
        }}
      >
        {children || ''}
      </Streamdown>
    </div>
  )
}
