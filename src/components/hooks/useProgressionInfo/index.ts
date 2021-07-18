import * as React from 'react'
import client, { gql } from '../../../util/gqlClient'

export default function useProgressionInfo(progressionSeeds?: number[]) {
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
      const result = await client.request(
        gql`
          ${query}
        `
      )
      setProgData(Object.values(result))
    })()
  }, [progressionSeeds])
  return progData
}
