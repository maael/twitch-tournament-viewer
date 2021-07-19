import * as React from 'react'
import { GraphQLClient, gql } from 'graphql-request'

export { gql }

export default function useClient(apiKey: string) {
  return React.useMemo(
    () =>
      new GraphQLClient('https://api.smash.gg/gql/alpha', {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }),
    [apiKey]
  )
}
