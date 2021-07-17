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
  return (
    <div style={{ maxHeight: '100vh', overflow: 'auto', maxWidth: '100vw' }}>
      <h2>{pool?.phaseGroup?.phase?.event?.tournament?.name}</h2>
      <h3>{pool?.phaseGroup?.phase?.event?.name}</h3>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <h4>{pool?.phaseGroup?.phase?.name}</h4>
        <select onChange={(e) => setPhaseGroupId(Number(e.target.value))} value={phaseGroupId} className="select-css">
          {phaseGroupOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.displayIdentifier}
            </option>
          ))}
        </select>
      </div>
      <DoubleEliminationBracket data={pool} mobileBreakpoint={992} />
    </div>
  )
}
