import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { getBuildBySlug } from "@/server/services/build.service"
import { RecognitionButton } from "@/components/recognition/RecognitionButton"
import { getRecognitionInfo } from "@/server/services/recognition.service"

const VISIBILITY_LABELS: Record<string, string> = {
  PUBLIC: "Public",
  PRIVATE: "Private",
  STATISTICS: "Statistics Mode",
  SHOWCASE: "Showcase Mode",
}

export default async function BuildPage({
  params,
}: {
  params: Promise<{ username: string; build: string }>
}) {
  const { username, build: buildName } = await params
  const session = await auth()
  const build = await getBuildBySlug(username, buildName, session?.user?.id)

  if (!build) notFound()

  const recognition = await getRecognitionInfo("build", build.id, session?.user?.id)

  const codeVisible = build.visibility === "PUBLIC" || build.visibility === "PRIVATE"
  const readmeOnly = build.visibility === "SHOWCASE"
  const statsOnly = build.visibility === "STATISTICS"

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">
          {username}/{build.name}
        </h1>
        <div className="flex items-center gap-2">
          <RecognitionButton
            targetType="build"
            targetId={build.id}
            initialRecognized={recognition.recognized}
            initialCount={recognition.count}
          />
          <span className="text-xs rounded-full border border-neutral-700 px-2 py-1 text-neutral-300">
            {VISIBILITY_LABELS[build.visibility]}
          </span>
        </div>
      </div>

      {build.description && <p className="text-neutral-400 mb-6">{build.description}</p>}

      <div className="flex gap-6 text-sm text-neutral-400 mb-6">
        <span>{build.commitsCount} commits</span>
        <span>{build.contributorsCount} contributors</span>
        <span>{build.linesOfCode.toLocaleString()} lines</span>
        {build.statsSource === "manual" && (
          <span className="text-neutral-600 italic">self-reported</span>
        )}
      </div>

      {build.languages.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {build.languages.map((lang) => (
            <span key={lang} className="text-xs rounded-md bg-neutral-900 border border-neutral-800 px-2 py-1">
              {lang}
            </span>
          ))}
        </div>
      )}

      {(codeVisible || readmeOnly) && build.readme && (
        <div className="rounded-md border border-neutral-800 bg-neutral-900 p-4 whitespace-pre-wrap text-sm text-neutral-200">
          {build.readme}
        </div>
      )}

      {statsOnly && (
        <p className="text-neutral-500 text-sm italic">
          Code is hidden. Only stats are visible for this Build.
        </p>
      )}
    </div>
  )
}