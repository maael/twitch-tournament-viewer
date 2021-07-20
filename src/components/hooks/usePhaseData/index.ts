import * as React from 'react'
import { PhaseData, PhaseGroupData } from '../../../types'
import { TwitchContext } from '../../context/Twitch'
import useClient from '../useClient'
import { PHASE_GROUP_INFO, PHASE_GROUP_SETS, PHASE_INFO } from './queries'

export enum DataState {
  Default = 'DEFAULT',
  Loading = 'LOADING',
  Error = 'ERROR',
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export default function usePhaseData(phase?: number, phaseGroupId?: number) {
  const { config } = React.useContext(TwitchContext)
  const client = useClient(config?.broadcaster?.apiKey || '')
  const [phaseGroupOptions, setPhaseGroupOptions] = React.useState<{ id: number; displayIdentifier: string }[]>([])
  const [pool, setPool] = React.useState<PhaseGroupData | undefined>(undefined)
  const [dataState, setDataState] = React.useState<DataState>(DataState.Default)
  React.useEffect(() => {
    ;(async () => {
      if (!phase) {
        console.warn('No phase set, please configure the extension', phase)
        return
      }
      try {
        setDataState(DataState.Loading)
        console.info('1', phase)
        const result = await client.request<PhaseData>(PHASE_INFO, { phaseId: phase }).catch((e) => console.error(e))
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
  }, [phase, client])
  React.useEffect(() => {
    ;(async () => {
      if (!phaseGroupId) return
      console.info('2', phaseGroupId)
      try {
        setDataState(DataState.Loading)
        const result = await client
          .request<PhaseGroupData>(PHASE_GROUP_INFO, { phaseGroupId: phaseGroupId })
          .catch((e) => console.error(e))
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
          const setsResult = await client
            .request<PhaseGroupData>(PHASE_GROUP_SETS, {
              phaseGroupId: phaseGroupId,
              page,
            })
            .catch((e) => console.error(e))
          sets = sets.concat(setsResult?.phaseGroup.sets.nodes || [])
          lastPage = (setsResult?.phaseGroup.sets as any)?.pageInfo?.totalPages
        } while (lastPage && lastPage > page)
        sets = sets.map((s) => {
          s.slots = s.slots.map((slot) => {
            slot.score = s.displayScore.match(
              new RegExp(`${escapeRegExp(slot.entrant.name)} (?<score>\\d+)`)
            )?.groups?.score
            if (!slot.score && s.displayScore === 'DQ' && slot.entrant.id !== s.winnerId) {
              slot.score = 'DQ'
            }
            return slot
          })
          return s
        })
        if (!result) return
        result.phaseGroup.sets = { nodes: sets }
        console.info('phase data', { result })
        setPool(result)
        setDataState(DataState.Default)
      } catch (e) {
        setDataState(DataState.Error)
        throw e
      }
    })()
  }, [phaseGroupId, client])
  return {
    phaseGroupOptions,
    pool,
    dataState,
  }
}
