import * as React from 'react'
import usePhaseData from '../components/hooks/usePhaseData'
import DoubleEliminationBracket from '../components/primitives/DoubleEliminationBracket'

export default function VideoComponent() {
  const [phaseGroupId, setPhaseGroupId] = React.useState<number | undefined>()
  const { phaseGroupOptions, pool } = usePhaseData(phaseGroupId)
  React.useEffect(() => {
    if (phaseGroupOptions.length === 1) {
      setPhaseGroupId(phaseGroupOptions[0].id)
    }
  }, [phaseGroupOptions])
  return (
    <div>
      <style>{`:root { --color-background: rgba(24,24,27, 0.5); --color-text: #ffffff; }`}</style>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'flex-end' }}>
        <h2>{pool?.phaseGroup?.phase?.event?.tournament?.name}</h2>
        <h3>{pool?.phaseGroup?.phase?.event?.name}</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: '1em' }}>
        <h4>{pool?.phaseGroup?.phase?.name}</h4>
        <select onChange={(e) => setPhaseGroupId(Number(e.target.value))} value={phaseGroupId} className="select-css">
          {phaseGroupOptions.map((o) => (
            <option key={o.id} value={o.id}>
              Pool {o.displayIdentifier}
            </option>
          ))}
        </select>
      </div>
      <DoubleEliminationBracket data={pool} mobileBreakpoint={0} />
    </div>
  )
}
