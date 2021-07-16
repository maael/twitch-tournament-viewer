import * as React from 'react'
import { GraphQLClient, gql } from 'graphql-request'
import { TwitchContext } from '../context/Twitch'
import { PhaseData, PhaseGroupData } from '../../types'

const client = new GraphQLClient('https://api.smash.gg/gql/alpha', {
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SMASH_GG_TOKEN}`,
  },
})

export default function usePhaseData(phaseGroupId?: number) {
  const { config } = React.useContext(TwitchContext)
  const [phaseGroupOptions, setPhaseGroupOptions] = React.useState<{ id: number; displayIdentifier: string }[]>([])
  const [pool, setPool] = React.useState<PhaseGroupData | undefined>(undefined)
  const mappedPool = pool
  console.info(
    'p',
    mappedPool?.phaseGroup.sets.nodes?.reduce((acc, v) => {
      return { ...acc, [v.round]: (acc[v.round] || []).concat(v) }
    }, {})
  )
  React.useEffect(() => {
    ;(async () => {
      if (!config.broadcaster.phase) {
        console.warn('No phase set, please configure the extension', config.broadcaster)
        return
      }
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
      const result = await client.request<PhaseData>(query, { phaseId: config.broadcaster.phase })
      const options = (result?.phase?.phaseGroups.nodes || []).map((n) => ({
        id: n.id,
        displayIdentifier: n.displayIdentifier,
      }))
      setPhaseGroupOptions(options)
    })()
  }, [config.broadcaster, config.broadcaster?.phase])
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
                completedAt
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
      const result = await client.request<PhaseGroupData>(query, { phaseGroupId: phaseGroupId })
      setPool(result)
    })()
  }, [phaseGroupId])
  return {
    phaseGroupOptions,
    pool,
  }
}
