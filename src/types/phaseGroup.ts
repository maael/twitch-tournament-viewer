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
}
export interface Tournament {
  name: string
}
export interface Sets {
  nodes?: NodesEntity[] | null
}
export interface NodesEntity {
  identifier: string
  winnerId?: null
  round: number
  fullRoundText: string
  vodUrl?: null
  state: number
  games?: null
  displayScore?: null
  slots?: SlotsEntity[] | null
}
export interface SlotsEntity {
  id: string
  entrant?: Entrant | null
}
export interface Entrant {
  id: number
  name: string
}
