import { ActivityState } from './common'

export interface PhaseGroupData {
  phaseGroup: PhaseGroup
}
export interface PhaseGroup {
  id: number
  displayIdentifier: string
  bracketType: string
  numRounds?: null
  phase: Phase
  sets: Sets
}
export interface Phase {
  id: number
  name: string
  bracketType: string
  phaseOrder: number
  groupCount: number
  event: Event
}
export interface Event {
  name: string
  tournament: Tournament
  phases: { id: number; name: string }[]
}
export interface Tournament {
  name: string
}
export interface Sets {
  nodes?: NodesEntity[] | null
}
export interface NodesEntity {
  completedAt: number
  identifier: string
  winnerId?: number | null
  round: number
  fullRoundText: string
  vodUrl?: null
  state: ActivityState
  games?: null
  displayScore?: null
  slots?: SlotsEntity[] | null
}
export interface SlotsEntity {
  id: string
  prereqId?: string
  prereqType?: string
  prereqPlacement?: number
  entrant?: Entrant | null
  score?: string
}
export interface Entrant {
  id: number
  name: string
  participants?: Participant[]
  isDisqualified?: boolean
}
export interface Participant {
  gamerTag: string
  prefix: string
}
