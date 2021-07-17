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

function mapData(
  data?: PhaseGroupData
): { title: string; id?: number; seeds: { id: number | string; date: string; teams: { name: string }[] } }[] {
  if (!data) return initialData as any
  return Object.values(
    data?.phaseGroup.sets.nodes?.reduce((acc, s) => {
      return { ...acc, [s.round]: (acc[s.round] || []).concat(s) }
    }, {}) || {}
  )
    .map((v: any) => ({
      title: v[0].fullRoundText,
      id: v[0].round,
      seeds: v.map((i) => ({
        id: i.identifier,
        date: i.completedAt ? new Date(i.completedAt * 1000).toLocaleString() : undefined,
        teams: i.slots.map((s) => s.entrant),
      })),
    }))
    .sort((a, b) => (a.hasOwnProperty('id') && b.hasOwnProperty('id') ? Math.abs(a.id) - Math.abs(b.id) : 0))
}

export default function DoubleEliminationBracket({
  data,
  mobileBreakpoint = 0,
}: {
  data?: PhaseGroupData
  mobileBreakpoint?: number
}) {
  const mappedData = mapData(data)
  const winners = mappedData.filter((d) => !d.hasOwnProperty('id') || d.id! > 0)
  const losers = mappedData.filter((d) => d.hasOwnProperty('id') && d.id! < 0)
  return (
    <div style={{ justifyContent: 'center' }}>
      {winners.length ? (
        <Bracket rounds={winners as unknown as RoundProps[]} mobileBreakpoint={mobileBreakpoint} />
      ) : null}
      {losers.length ? (
        <>
          <div style={{ height: '2em' }} />
          <Bracket rounds={losers as unknown as RoundProps[]} mobileBreakpoint={mobileBreakpoint} />
        </>
      ) : null}
    </div>
  )
}
