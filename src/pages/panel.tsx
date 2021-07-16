import * as React from 'react'
import { GraphQLClient, gql } from 'graphql-request'
import { TwitchContext } from '../components/context/Twitch'
import DoubleEliminationBracket from '../components/primitives/DoubleEliminationBracket'

const client = new GraphQLClient('https://api.smash.gg/gql/alpha', {
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SMASH_GG_TOKEN}`,
  },
})

export default function Index() {
  const { config } = React.useContext(TwitchContext)
  const [phaseGroupOptions, setPhaseGroupOptions] = React.useState<{ id: string; displayIdentifier: string }[]>([])
  const [phaseGroupId, setPhaseGroupId] = React.useState<string | undefined>(undefined)
  const [pool, setPool] = React.useState<any>(undefined)
  React.useEffect(() => {
    ;(async () => {
      if (!config.broadcaster.phase) return
      console.info('1', config.broadcaster.phase)
      const query = gql`
        query TournamentQuery($phaseId: ID) {
          phase(id: $phaseId) {
            name
            phaseGroups {
              nodes {
                id
                displayIdentifier
              }
            }
          }
        }
      `
      const result = await client.request(query, { phaseId: config.broadcaster.phase })
      const options = result.phase.phaseGroups.nodes
      setPhaseGroupOptions(options)
      if (options.length === 1) {
        setPhaseGroupId(options[0].id)
      }
    })()
  }, [config.broadcaster.phase])
  React.useEffect(() => {
    ;(async () => {
      if (!phaseGroupId) return
      console.info('2', phaseGroupId)
      const query = gql`
        query TournamentQuery($phaseGroupId: ID) {
          phaseGroup(id: $phaseGroupId) {
            id
            displayIdentifier
            bracketType
            numRounds
            phase {
              id
              name
              bracketType
              phaseOrder
              groupCount
              event {
                name
                tournament {
                  name
                }
              }
            }
            sets(page: 1, perPage: 100) {
              nodes {
                identifier
                winnerId
                round
                fullRoundText
                vodUrl
                state
                games {
                  orderNum
                  stage {
                    name
                  }
                  winnerId
                  selections {
                    participant {
                      id
                      gamerTag
                    }
                    selectionType
                    selectionValue
                  }
                }
                displayScore
                slots {
                  id
                  entrant {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      `
      const result = await client.request(query, { phaseGroupId: phaseGroupId })
      setPool(result)
    })()
  }, [phaseGroupId])
  return (
    <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <h2>{pool?.phaseGroup?.phase?.event?.tournament?.name}</h2>
      <h3>{pool?.phaseGroup?.phase?.event?.name}</h3>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <h4>{pool?.phaseGroup?.phase?.name}</h4>
        <select onChange={(e) => setPhaseGroupId(e.target.value)} value={phaseGroupId}>
          {phaseGroupOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.displayIdentifier}
            </option>
          ))}
        </select>
      </div>
      <DoubleEliminationBracket />
      {pool?.phaseGroup?.sets?.nodes?.map((n) => {
        return (
          <div key={n.identifier}>
            ({n.identifier}) Round: {n.round} -{' '}
            {n.slots
              .map((s) => s?.entrant?.name)
              .filter(Boolean)
              .join(' vs ')}
          </div>
        )
      })}
    </div>
  )
}
