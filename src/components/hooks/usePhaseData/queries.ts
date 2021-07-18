import { gql } from 'graphql-request'

export const PHASE_INFO = gql`
  query TournamentQuery($phaseId: ID) {
    phase(id: $phaseId) {
      name
      phaseGroups {
        nodes {
          id
          displayIdentifier
        }
      }
    }
  }
`

export const PHASE_GROUP_INFO = gql`
  query TournamentQuery($phaseGroupId: ID) {
    phaseGroup(id: $phaseGroupId) {
      id
      displayIdentifier
      bracketType
      phase {
        id
        name
        bracketType
        phaseOrder
        groupCount
        event {
          name
          tournament {
            name
          }
          phases {
            id
            name
          }
        }
      }
    }
  }
`

export const PHASE_GROUP_SETS = gql`
  query TournamentQuery($phaseGroupId: ID, $page: Int) {
    phaseGroup(id: $phaseGroupId) {
      sets(page: $page, perPage: 30) {
        pageInfo {
          page
          totalPages
        }
        nodes {
          completedAt
          identifier
          winnerId
          round
          fullRoundText
          vodUrl
          state
          displayScore
          games {
            stage {
              name
            }
            selections {
              selectionType
              selectionValue
            }
          }
          slots {
            id
            prereqId
            prereqType
            prereqPlacement
            entrant {
              id
              name
              isDisqualified
              participants {
                gamerTag
                prefix
              }
            }
          }
        }
      }
    }
  }
`
