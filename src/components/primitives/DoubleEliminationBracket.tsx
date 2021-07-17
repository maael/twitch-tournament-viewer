import * as React from 'react'
import { Bracket, RoundProps } from 'react-brackets'
import { PhaseGroupData } from '../../types'

const initialData: RoundProps[] = [
  {
    title: 'Round One',
    id: 2,
    seeds: [
      {
        id: 1,
        date: new Date().toDateString(),
        teams: [{ name: 'Team A' }, { name: 'Team B' }],
      },
      {
        id: 2,
        date: new Date().toDateString(),
        teams: [{ name: 'Team A' }, { name: 'Team B' }],
      },
    ],
  },
  {
    title: 'Round Two',
    seeds: [
      {
        id: 3,
        date: new Date().toDateString(),
        teams: [{ name: 'Team A' }, { name: 'Team B' }],
      },
    ],
  },
]

function mapData(data?: PhaseGroupData) {
  if (!data) return initialData
  return Object.values(
    data?.phaseGroup.sets.nodes?.reduce((acc, s) => {
      return { ...acc, [s.round]: (acc[s.round] || []).concat(s) }
    }, {}) || {}
  ).map((v: any) => ({
    title: v[0].fullRoundText,
    id: v[0].round,
    seeds: v.map((i) => ({
      id: i.identifier,
      date: i.completedAt ? new Date(i.completedAt * 1000).toLocaleString() : undefined,
      teams: i.slots.map((s) => s.entrant),
    })),
  }))
}

export default function DoubleEliminationBracket({
  data,
  mobileBreakpoint = 0,
}: {
  data?: PhaseGroupData
  mobileBreakpoint?: number
}) {
  const mappedData = mapData(data)
  return (
    <div style={{ justifyContent: 'center' }}>
      <Bracket rounds={mappedData} mobileBreakpoint={mobileBreakpoint} />
    </div>
  )
}
