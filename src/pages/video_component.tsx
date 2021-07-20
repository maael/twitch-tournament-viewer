import * as React from 'react'
import { ProgressionInfoProvider } from '../components/context/ProgressionInfo'
import { TwitchContext } from '../components/context/Twitch'
import usePhaseData, { DataState } from '../components/hooks/usePhaseData'
import CustomBracket from '../components/primitives/CustomBracket'
import Loading from '../components/primitives/Loading'

export default function VideoComponent() {
  const { config } = React.useContext(TwitchContext)
  const [phaseGroupId, setPhaseGroupId] = React.useState<number | undefined>()
  const [phaseId, setPhaseId] = React.useState<number | undefined>(() => config?.broadcaster?.phase || undefined)
  const { phaseGroupOptions, pool, dataState } = usePhaseData(phaseId, phaseGroupId)
  console.info({ phaseId, phaseGroupId, config })
  React.useEffect(() => {
    if (config?.broadcaster?.phase) {
      setPhaseId(config?.broadcaster?.phase)
    }
  }, [config?.broadcaster?.phase])
  React.useEffect(() => {
    if (phaseGroupOptions.length > 0) {
      setPhaseGroupId(phaseGroupOptions[0].id)
    }
  }, [phaseGroupOptions])
  const progressionSeeds = React.useMemo(
    () =>
      pool?.phaseGroup.sets.nodes
        ?.flatMap((n) => n.slots?.flatMap((s) => s.seed?.progressionSeedId))
        .filter(Boolean) as number[],
    [pool]
  )
  return (
    <ProgressionInfoProvider progressionSeeds={progressionSeeds}>
      <div style={{ paddingTop: '1em', display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '100vh' }}>
        <style>{`:root { --color-background: rgba(24,24,27, 0.5); --color-text: #ffffff; }`}</style>
        {dataState === DataState.Loading ? (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loading />
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '0.2em' }}>
              <div
                style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'flex-end', marginLeft: '-0.5em' }}
              >
                <h2>{pool?.phaseGroup?.phase?.event?.tournament?.name}</h2>
                <h3>{pool?.phaseGroup?.phase?.event?.name}</h3>
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'flex-end', marginLeft: '-0.5em' }}
              >
                {(pool?.phaseGroup?.phase?.event?.phases || []).length > 1 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                      marginBottom: '1em',
                    }}
                  >
                    <select onChange={(e) => setPhaseId(Number(e.target.value))} value={phaseId} className="select-css">
                      {pool?.phaseGroup?.phase?.event?.phases.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
                {phaseGroupOptions.length > 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                      marginBottom: '1em',
                    }}
                  >
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
            </div>
            <CustomBracket
              data={pool}
              onClickRound={(newPhaseId, newPhaseGroupId) => {
                setPhaseGroupId(newPhaseGroupId)
                setPhaseId(newPhaseId)
              }}
            />
          </>
        )}
      </div>
    </ProgressionInfoProvider>
  )
}
