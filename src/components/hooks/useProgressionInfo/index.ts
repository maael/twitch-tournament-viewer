import * as React from 'react'
import { TwitchContext } from '../../context/Twitch'
import useClient, { gql } from '../useClient'

export default function useProgressionInfo(progressionSeeds?: number[]) {
  const { config } = React.useContext(TwitchContext)
  const client = useClient(config?.broadcaster?.apiKey || '')
  const [progData, setProgData] = React.useState<any>([])
  React.useEffect(() => {
    ;(async () => {
      if (!progressionSeeds || progressionSeeds.length === 0) {
        setProgData([])
        return
      }
      const query = `query {
        ${progressionSeeds
          .map(
            (s) => `seed_${s}: seed(id: ${s}) {
          id
          progressionSeedId
          phase {
            id
            name
          }
          phaseGroup {
            id
            displayIdentifier
          }
        }`
          )
          .join('\n')}
      }`
      const result = await client
        .request(
          gql`
            ${query}
          `
        )
        .catch((e) => console.error(e))
      setProgData(Object.values(result || {}))
    })()
  }, [progressionSeeds, client])
  return progData
}
