import * as React from 'react'
import { GraphQLClient } from 'graphql-request'
import { TwitchContext } from '../../context/Twitch'
import { PhaseData, PhaseGroupData } from '../../../types'
import { PHASE_GROUP_INFO, PHASE_GROUP_SETS, PHASE_INFO } from './queries'

const client = new GraphQLClient('https://api.smash.gg/gql/alpha', {
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SMASH_GG_TOKEN}`,
  },
})

export enum DataState {
  Default = 'DEFAULT',
  Loading = 'LOADING',
  Error = 'ERROR',
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export default function usePhaseData(phaseGroupId?: number) {
  const { config } = React.useContext(TwitchContext)
  const [phaseGroupOptions, setPhaseGroupOptions] = React.useState<{ id: number; displayIdentifier: string }[]>([])
  const [pool, setPool] = React.useState<PhaseGroupData | undefined>(undefined)
  const [dataState, setDataState] = React.useState<DataState>(DataState.Default)
  React.useEffect(() => {
    ;(async () => {
      if (!config.broadcaster.phase) {
        console.warn('No phase set, please configure the extension', config.broadcaster)
        return
      }
      try {
        setDataState(DataState.Loading)
        console.info('1', config.broadcaster.phase)
        const result = await client.request<PhaseData>(PHASE_INFO, { phaseId: config.broadcaster.phase })
        const options = (result?.phase?.phaseGroups.nodes || []).map((n) => ({
          id: n.id,
          displayIdentifier: n.displayIdentifier,
        }))
        setPhaseGroupOptions(options)
        setDataState(DataState.Default)
      } catch (e) {
        setDataState(DataState.Error)
        throw e
      }
    })()
  }, [config.broadcaster, config.broadcaster?.phase])
  React.useEffect(() => {
    ;(async () => {
      if (!phaseGroupId) return
      console.info('2', phaseGroupId)
      try {
        setDataState(DataState.Loading)
        const result = await client.request<PhaseGroupData>(PHASE_GROUP_INFO, { phaseGroupId: phaseGroupId })
        let page = 0
        let lastPage: number | undefined = 0
        let sets: any = []
        do {
          if (page <= lastPage) {
            page = page + 1
          }
          if (page > lastPage) {
            lastPage = 0
          }
          console.info(page, lastPage)
          const setsResult = await client.request<PhaseGroupData>(PHASE_GROUP_SETS, {
            phaseGroupId: phaseGroupId,
            page,
          })
          sets = sets.concat(setsResult.phaseGroup.sets.nodes)
          console.info({ sets })
          lastPage = (setsResult.phaseGroup.sets as any).pageInfo.totalPages
        } while (lastPage && lastPage > page)
        sets = sets.map((s) => {
          s.slots = s.slots.map((slot) => {
            slot.score = s.displayScore.match(
              new RegExp(`${escapeRegExp(slot.entrant.name)} (?<score>\\d+)`)
            )?.groups?.score
            return slot
          })
          return s
        })
        result.phaseGroup.sets = { nodes: sets }
        setPool(result)
        setDataState(DataState.Default)
      } catch (e) {
        setDataState(DataState.Error)
        throw e
      }
    })()
  }, [phaseGroupId])
  return {
    phaseGroupOptions,
    pool,
    dataState,
  }
}
