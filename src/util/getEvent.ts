import { gql, GraphQLClient } from 'graphql-request'

export async function getEvent(client: GraphQLClient, link: string) {
  const match = link.match(/https:\/\/smash.gg\/tournament\/(?<t>.+?)\/event\/(?<e>.+?)\/.*/)
  const tournament = match?.groups?.t
  const event = match?.groups?.e
  const query = gql`
    query TournamentQuery($slug: String) {
      tournament(slug: $slug) {
        id
        name
        events(filter: {}) {
          id
          slug
          name
          phases {
            id
            name
          }
        }
      }
    }
  `
  if (!tournament || !event) {
    return undefined
  }
  const result = await client.request(query, { slug: tournament }).catch((e) => console.error(e))
  const foundEvent = result.tournament.events.find((e) => e.slug === `tournament/${tournament}/event/${event}`)
  return {
    name: result.tournament.name,
    event: foundEvent,
  }
}
