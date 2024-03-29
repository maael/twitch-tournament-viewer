import * as React from 'react'
import Xarrow from 'react-xarrows'
import ScrollContainer from 'react-indiana-drag-scroll'
import { PhaseGroupData } from '../../types'
import { NodesEntity, SlotsEntity } from '../../types/phaseGroup'
import { ProgressionInfoContext } from '../context/ProgressionInfo'

function reduceRounds(acc: any, n: NodesEntity) {
  return {
    ...acc,
    [n.round]: (acc[n.round] || []).concat(n),
  }
}

export default function CustomBracket({
  data,
  onClickRound,
}: {
  data?: PhaseGroupData
  onClickRound?: (phaseId: number, phaseGroupId: number) => void
}) {
  const winnerRounds = data?.phaseGroup.sets?.nodes?.filter((n) => n.round >= 0).reduce(reduceRounds, {}) || {}
  const loserRounds = data?.phaseGroup.sets?.nodes?.filter((n) => n.round < 0).reduce(reduceRounds, {}) || {}
  return data ? (
    <div style={{ position: 'relative', flex: 1 }}>
      <ScrollContainer
        style={{ maxHeight: '100%', maxWidth: '100vw', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', userSelect: 'none' }}>
          <Rounds rounds={winnerRounds} onClickRound={onClickRound} />
          <Rounds rounds={loserRounds} onClickRound={onClickRound} reverse />
        </div>
      </ScrollContainer>
    </div>
  ) : null
}

function getJustifyType(entries: [string, NodesEntity[]][], i: number) {
  const previous = entries[i - 1]
  if (!previous) return 'space-between'
  return previous[1].length < entries[i][1].length ? 'space-between' : 'space-around'
}

function Rounds({
  rounds,
  reverse,
  onClickRound,
}: {
  rounds: { [round: number]: NodesEntity[] }
  reverse?: boolean
  onClickRound?: (phaseId: number, phaseGroupId: number) => void
}) {
  const entries = Object.entries(rounds)
  if (reverse) entries.reverse()
  const allowedSlots = entries
    .flatMap(([_, roundItems]) => roundItems.flatMap((i) => i.slots?.flatMap((s) => s.id)))
    .filter(Boolean) as string[]
  const progData = React.useContext(ProgressionInfoContext)
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 100, paddingBottom: '3rem' }}>
      {entries.map(([k, roundItems], i) => (
        <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ marginBottom: '0.1em', fontWeight: 'bold', fontSize: '1.2em', whiteSpace: 'nowrap' }}>
            {roundItems[0].fullRoundText}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              flex: 1,
              justifyContent: getJustifyType(entries, i),
            }}
          >
            {roundItems
              .sort((a, b) => a.identifier.localeCompare(b.identifier) && a.identifier.length - b.identifier.length)
              .map((item) => (
                <Match key={item.identifier} allowedSlots={allowedSlots} item={item} />
              ))}
          </div>
        </div>
      ))}
      {progData.length > 0 ? <NextBracketColumn entries={entries} onClickRound={onClickRound} /> : null}
    </div>
  )
}

function NextBracketColumn({
  entries,
  onClickRound,
}: {
  entries: [string, NodesEntity[]][]
  onClickRound?: (phaseId: number, phaseGroupId: number) => void
}) {
  const i = entries.length - 1
  const roundItems = (entries[i] || [])[1]
  const progData = React.useContext(ProgressionInfoContext)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ marginBottom: '0.1em', fontWeight: 'bold', fontSize: '1.2em', whiteSpace: 'nowrap' }}>
        Next Bracket
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          flex: 1,
          justifyContent: 'space-around',
        }}
      >
        {roundItems
          .sort((a, b) => a.identifier.localeCompare(b.identifier) && a.identifier.length - b.identifier.length)
          .map((item) => (
            <div key={item.identifier} style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              {item.slots?.map((slot) => {
                const progSeed = slot.seed?.progressionSeedId
                  ? progData.find((d) => d.id === slot.seed?.progressionSeedId)
                  : undefined
                return progSeed ? (
                  <div key={slot.id} id={`next-${slot.id}`}>
                    <div style={{ zIndex: -1, position: 'relative' }}>
                      <Xarrow
                        start={`next-${slot.id}`}
                        end={`slot-${slot.id}`}
                        path="grid"
                        curveness={0.5}
                        headSize={0}
                        divContainerStyle={{ zIndex: -2 }}
                        lineColor="rgba(29, 78, 216, 0.5)"
                        dashness={true}
                      />
                    </div>
                    <div
                      style={{
                        whiteSpace: 'nowrap',
                        flex: 1,
                        background: `rgba(30, 64, 175, 0.5)`,
                        padding: '0.3em 0.8em',
                        borderRadius: '0.3em',
                        cursor: 'pointer',
                      }}
                      onClick={() => onClickRound && onClickRound(progSeed.phase.id, progSeed.phaseGroup.id)}
                    >
                      {progSeed.phase.name}
                    </div>
                  </div>
                ) : null
              })}
            </div>
          ))}
      </div>
    </div>
  )
}

function Match({ item, allowedSlots }: { item: NodesEntity; allowedSlots: string[] }) {
  return (
    <div id={(item.slots || [])[0].id}>
      <div id={(item.slots || [])[1].id}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', zIndex: 9, position: 'relative' }}>
          <div
            style={{
              height: '2.2em',
              width: '2.2em',
              lineHeight: '2.3em',
              background: 'rgb(30, 64, 175)',
              borderRadius: '100%',
              textAlign: 'center',
              marginRight: '0.3em',
              fontSize: '0.9em',
            }}
          >
            {item.identifier}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', borderRadius: '0.3em', flex: 1 }}>
            {item.slots?.map((s, i) => (
              <Slot
                key={s.id}
                slot={s}
                winner={item.winnerId || undefined}
                cornerStyle={item.slots?.length === 1 ? 'all' : i === 0 ? 'top' : 'bottom'}
                allowedSlots={allowedSlots}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Slot({
  slot,
  winner,
  cornerStyle,
  allowedSlots,
}: {
  slot: SlotsEntity
  winner?: number
  cornerStyle?: 'all' | 'top' | 'bottom'
  allowedSlots: string[]
}) {
  const prefix = (slot.entrant?.participants || [])[0]?.prefix
  const name = (slot.entrant?.participants || [])[0]?.gamerTag
  const isWinner = winner === slot.entrant?.id
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '0.4em',
        background: `rgba(30, 64, 175, ${isWinner ? 1 : 0.5})`,
        flex: 1,
        padding: '0.3em 0.8em',
        borderTopLeftRadius: cornerStyle !== 'bottom' ? '0.3em' : undefined,
        borderTopRightRadius: cornerStyle !== 'bottom' ? '0.3em' : undefined,
        borderBottomLeftRadius: cornerStyle !== 'top' ? '0.3em' : undefined,
        borderBottomRightRadius: cornerStyle !== 'top' ? '0.3em' : undefined,
      }}
      title={`${prefix || ''} ${prefix ? '|' : ''} ${name}`.trim()}
      id={`slot-${slot.id}`}
    >
      {prefix ? (
        <span style={{ opacity: '0.7', whiteSpace: 'nowrap', display: 'flex', flexDirection: 'row' }}>
          <span
            style={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              maxWidth: '5em',
              display: 'inline-block',
            }}
          >
            {prefix}
          </span>
          <span style={{ display: 'inline-block', marginLeft: '0.4em' }}>|</span>
        </span>
      ) : null}
      <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{name}</span>
      {slot.score ? <span>{slot.score}</span> : isWinner ? <span>✓</span> : null}
      {slot.entrant?.isDisqualified ? <span>DQ</span> : null}
      {allowedSlots.includes(`${slot.prereqId}-${slot.prereqPlacement}`) ? (
        <div style={{ zIndex: -1, position: 'relative' }}>
          <Xarrow
            start={`${slot.prereqId}-${slot.prereqPlacement}`}
            end={slot.id}
            path="grid"
            curveness={0.5}
            headSize={0}
            divContainerStyle={{ zIndex: -2 }}
            lineColor="rgba(29, 78, 216, 0.7)"
          />
        </div>
      ) : null}
    </div>
  )
}
