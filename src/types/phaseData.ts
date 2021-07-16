export interface PhaseData {
  phase: Phase
}
export interface Phase {
  name: string
  phaseGroups: PhaseGroups
}
export interface PhaseGroups {
  nodes?: NodesEntity[] | null
}
export interface NodesEntity {
  id: number
  displayIdentifier: string
}
