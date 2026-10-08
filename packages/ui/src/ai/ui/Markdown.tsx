import cx from 'classnames'
import { type BundledTheme, defaultRehypePlugins, Streamdown } from 'streamdown'
import { useMarkdownPlugins } from '../../components/markdownPlugins'
import { useChatConfig } from '../core/config'
import { rehypeCodeBreaks } from './codeBreaks'

const shikiTheme: [BundledTheme, BundledTheme] = ['github-light', 'github-dark']

// Passing rehypePlugins replaces Streamdown's list rather than extending it,
// so its own plugins go first.
const rehypePlugins = [...Object.values(defaultRehypePlugins), rehypeCodeBreaks]

interface MarkdownProps {
  children: string
  isStreaming?: boolean
}

export default function Markdown({ children, isStreaming }: MarkdownProps) {
  const { markdownComponents } = useChatConfig()
  const plugins = useMarkdownPlugins(children, true)
  return (
    <div className="markdown whitespace-normal text-start w-full">
      <Streamdown
        mode={isStreaming ? 'streaming' : 'static'}
        {...(isStreaming === undefined ? {} : { isAnimating: isStreaming })}
        {...(isStreaming ? ({ caret: 'block' } as const) : {})}
        plugins={plugins}
        rehypePlugins={rehypePlugins}
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
          // Host overrides win per tag, including `a` when supplied.
          ...markdownComponents,
        }}
      >
        {children || ''}
      </Streamdown>
    </div>
  )
}
