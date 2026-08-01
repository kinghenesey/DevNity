interface BuildSignal {
  updatedAt: Date
  statsSource: string
}

interface CredInput {
  createdAt: Date
  builds: BuildSignal[]
}

/**
 * Cred formula — deliberately conservative. Only counts signals we can
 * actually verify today. Nothing here is self-reported or inflatable.
 *
 * Components (all capped, so no single lever dominates):
 *  - Account age:      +2 per month active, capped at 20
 *  - Builds created:    +5 per Build, capped at 30
 *  - Recent activity:  +10 per Build touched in the last 30 days, capped at 20
 *  - Verified git:      +0 for now — statsSource is "manual" for every Build
 *                        until real git hosting exists. This is intentional:
 *                        Cred should never reward unverifiable numbers.
 */
export function computeCred({ createdAt, builds }: CredInput): number {
  const now = Date.now()

  const monthsActive = Math.floor((now - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30))
  const ageScore = Math.min(monthsActive * 2, 20)

  const buildScore = Math.min(builds.length * 5, 30)

  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
  const recentBuilds = builds.filter((b) => b.updatedAt.getTime() > thirtyDaysAgo).length
  const activityScore = Math.min(recentBuilds * 10, 20)

  const verifiedScore = builds
    .filter((b) => b.statsSource === "git")
    .length * 0 // placeholder — real weighting arrives with real git hosting

  return ageScore + buildScore + activityScore + verifiedScore
}