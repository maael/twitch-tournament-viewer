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
      <DoubleEliminationBracket data={pool} />
    </div>
  )
}
