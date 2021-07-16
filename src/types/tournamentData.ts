export interface TournamentData {
  id: string
  name: string
  events: {
    id: string
    slug: string
    name: string
    phases: {
      id: string
      name: string
    }[]
  }[]
}
