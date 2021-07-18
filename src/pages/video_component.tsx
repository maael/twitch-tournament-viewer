import * as React from 'react'
import usePhaseData, { DataState } from '../components/hooks/usePhaseData'
import CustomBracket from '../components/primitives/CustomBracket'
import Loading from '../components/primitives/Loading'

export default function VideoComponent() {
  const [phaseGroupId, setPhaseGroupId] = React.useState<number | undefined>()
  console.info({ phaseGroupId })
  const { phaseGroupOptions, pool, dataState } = usePhaseData(phaseGroupId)
  React.useEffect(() => {
    if (phaseGroupOptions.length === 1) {
      setPhaseGroupId(phaseGroupOptions[0].id)
    }
  }, [phaseGroupOptions])
  return (
    <div style={{ paddingTop: '1em', display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '100vh' }}>
      <style>{`:root { --color-background: rgba(24,24,27, 0.5); --color-text: #ffffff; }`}</style>
      {dataState === DataState.Loading ? (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading />
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '0.5em' }}>
            <div
              style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'flex-end', marginLeft: '-0.5em' }}
            >
              <h2>{pool?.phaseGroup?.phase?.event?.tournament?.name}</h2>
              <h3>{pool?.phaseGroup?.phase?.event?.name}</h3>
            </div>
            {phaseGroupOptions.length > 1 ? (
              <div
                style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: '1em' }}
              >
                <h4>{pool?.phaseGroup?.phase?.name}</h4>
                <select
                  onChange={(e) => setPhaseGroupId(Number(e.target.value))}
                  value={phaseGroupId}
                  className="select-css"
                >
                  {phaseGroupOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      Pool {o.displayIdentifier}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
          <CustomBracket data={pool} />
        </>
      )}
    </div>
  )
}
