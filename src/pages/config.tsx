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
          const tournament = match?.groups.t
          const event = match?.groups.e
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
            setTournamentData(undefined)
            return
          }
          const result = await client.request(query, { slug: tournament })
          const foundEvent = result.tournament.events.find((e) => e.slug === `tournament/${tournament}/event/${event}`)
          setTournamentData({
            name: result.tournament.name,
            event: foundEvent,
          })
        }}
      >
        <div>
          <input type="text" placeholder="Event link..." name="eventLink" />
          <button type="submit">Fetch Brackets</button>
        </div>
        <small>
          Please enter a link to an event or bracket on <a href="https://smash.gg">https://smash.gg</a>
        </small>
      </form>
      <h1>Tournament: {tournamentData?.name || 'Please fetch brackets'}</h1>
      <h2>Event: {tournamentData?.event?.name || 'Please fetch brackets'}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const phase = (e.currentTarget.elements as any).phase.value
          twitch.configuration.set('broadcaster', '1.0', JSON.stringify({ phase }))
          twitch.rig.log('saved', { phase })
        }}
      >
        {tournamentData?.event?.phases ? (
          <div style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
            Choose the phase to show:
            <select name="phase" className="select-css">
              {(tournamentData?.event?.phases || []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <button disabled={!tournamentData?.event?.phases} type="submit">
          Save
        </button>
      </form>
    </div>
  )
}
