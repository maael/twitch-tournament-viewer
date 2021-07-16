export type { PhaseData } from './phaseData'
export type { PhaseGroupData } from './phaseGroup'
export type { TournamentData } from './tournamentData'

export type GQLResponse<T> = {
  data: T
  extensions: { cacheControl: { version: number; hints: null }; queryComplexity: number }
}
