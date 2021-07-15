import * as React from 'react'
import { GraphQLClient, gql } from 'graphql-request'
import { TwitchContext } from '../components/context/Twitch'

const client = new GraphQLClient('https://api.smash.gg/gql/alpha', {
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SMASH_GG_TOKEN}`,
  },
})

export default function Index() {
  const { twitch, config: _config } = React.useContext(TwitchContext)
  const [tournamentData, setTournamentData] = React.useState<any>()
  return (
    <div>
      <h2>Config</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const link = (e.currentTarget.elements as any).eventLink.value.trim()
          const match = link.match(/https:\/\/smash.gg\/tournament\/(?<t>.+?)\/event\/(?<e>.+?)\/.*/)
          const tournament = match.groups.t
          const event = match.groups.e
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
          const result = await client.request(query, { slug: tournament })
          console.info(result)
          const foundEvent = result.tournament.events.find((e) => e.slug === `tournament/${tournament}/event/${event}`)
          console.info(foundEvent)
          setTournamentData({
            name: result.tournament.name,
            event: foundEvent,
          })
        }}
      >
        <input type="text" placeholder="Event link..." name="eventLink" />
        <button type="submit">Fetch Brackets</button>
      </form>
      <h1>{tournamentData?.name}</h1>
      <h2>{tournamentData?.event?.name}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const phase = (e.currentTarget.elements as any).phase.value
          twitch.configuration.set('broadcaster', '1.0', JSON.stringify({ phase }))
        }}
      >
        <select name="phase">
          {(tournamentData?.event?.phases || []).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button type="submit">Save</button>
      </form>
    </div>
  )
}
