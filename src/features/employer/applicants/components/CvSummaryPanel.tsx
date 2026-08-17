import { FileSearch, Loader2, RefreshCw, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useApplicationCvSummary } from "../hooks/useApplicationCvSummary"

export default function CvSummaryPanel({ applicationId }: { applicationId: string | number }) {
  const { summary, isLoading, isGenerating, generate, refetch } = useApplicationCvSummary(applicationId)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileSearch className="h-5 w-5 text-primary" />
            CV summary
            {summary?.is_stale ? <Badge variant="secondary">Stale</Badge> : null}
          </CardTitle>
          {summary?.generation?.generated_at ? (
            <p className="mt-1 text-xs text-text-muted">
              Generated {new Date(summary.generation.generated_at).toLocaleString()}
            </p>
          ) : null}
        </div>
        <div className="flex gap-2">
          {summary ? (
            <Button variant="outline" size="sm" onClick={() => void refetch()} disabled={isGenerating}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          ) : null}
          <Button
            size="sm"
            onClick={() => generate({ force: Boolean(summary) })}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {summary ? "Regenerate" : "Generate"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!summary ? (
          <p className="text-sm text-text-muted">
            Generate an authorized backend CV summary for this applicant.
          </p>
        ) : (
          <>
            {summary.headline ? <p className="font-medium text-text-primary">{summary.headline}</p> : null}
            {summary.summary ? <p className="whitespace-pre-wrap text-sm text-text-secondary">{summary.summary}</p> : null}
            <SummaryList title="Strengths" items={summary.strengths} />
            <SummaryList title="Gaps" items={summary.gaps} />
            {summary.evidence && summary.evidence.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-text-primary">Evidence</h4>
                <div className="space-y-2">
                  {summary.evidence.map((item, index) => (
                    <div key={`${item.statement}-${index}`} className="rounded-md border border-border p-3 text-sm">
                      <p className="text-text-primary">{item.statement || "-"}</p>
                      {item.source ? <p className="mt-1 text-xs text-text-muted">{item.source}</p> : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {summary.ai_disclaimer ? (
              <p className="rounded-md bg-muted p-3 text-xs text-text-muted">{summary.ai_disclaimer}</p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  )
}

function SummaryList({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
      <ul className="list-disc space-y-1 pl-5 text-sm text-text-secondary">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
