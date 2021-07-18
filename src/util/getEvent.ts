import { GraphQLClient, gql } from 'graphql-request'

const client = new GraphQLClient('https://api.smash.gg/gql/alpha', {
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SMASH_GG_TOKEN}`,
  },
})

export async function getEvent(link: string) {
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
  const result = await client.request(query, { slug: tournament })
  const foundEvent = result.tournament.events.find((e) => e.slug === `tournament/${tournament}/event/${event}`)
  return {
    name: result.tournament.name,
    event: foundEvent,
  }
}
