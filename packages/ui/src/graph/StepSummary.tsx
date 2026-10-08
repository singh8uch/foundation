import Loader from '../components/Loader'
import Markdown from '../components/Markdown'
import { useRunFile, useStrings } from '../components/Provider'

// A summary is written once, when its step ends, so it is fetched without polling.
export function StepSummary({
  runSlug,
  path,
  maxHeight,
}: {
  runSlug: string
  path: string
  maxHeight: number
}) {
  const { dag } = useStrings()
  const { data, isLoading, error } = useRunFile(runSlug, path)
  return (
    <div className="panel border rounded overflow-y-auto p-3" style={{ maxHeight }}>
      {isLoading && data === undefined ? (
        <Loader text={dag.loadingSummary} size={24} />
      ) : error || data === undefined ? (
        <p className="text-xs theme-muted-text">{dag.summaryLoadFailed}</p>
      ) : (
        <Markdown mermaid httpsImagesOnly>
          {data}
        </Markdown>
      )}
    </div>
  )
}
