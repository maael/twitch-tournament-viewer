import * as React from 'react'
import DoubleEliminationBracket from '../components/primitives/DoubleEliminationBracket'
import usePhaseData from '../components/hooks/usePhaseData'

export default function Index() {
  const [phaseGroupId, setPhaseGroupId] = React.useState<number | undefined>(undefined)
  const { phaseGroupOptions, pool } = usePhaseData(phaseGroupId)
  React.useEffect(() => {
    if (phaseGroupOptions.length === 1) {
      setPhaseGroupId(phaseGroupOptions[0].id)
    }
  }, [phaseGroupOptions])
  const mappedPool = pool
  console.info(
    'p',
    mappedPool!.phaseGroup.sets.nodes?.reduce((acc, v) => {
      return { ...acc, [v.round]: (acc[v.round] || []).concat(v) }
    }, {})
  )
  return (
    <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <h2>{pool?.phaseGroup?.phase?.event?.tournament?.name}</h2>
      <h3>{pool?.phaseGroup?.phase?.event?.name}</h3>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <h4>{pool?.phaseGroup?.phase?.name}</h4>
        <select onChange={(e) => setPhaseGroupId(Number(e.target.value))} value={phaseGroupId}>
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
            {(n.slots || [])
              .map((s) => s?.entrant?.name)
              .filter(Boolean)
              .join(' vs ')}
          </div>
        )
      })}
    </div>
  )
}
