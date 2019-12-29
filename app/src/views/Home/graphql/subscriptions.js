import gql from 'graphql-tag'

export const USERS_SUBSCRIPTION = gql`
  subscription onSignup {
    onSignup {
      id
    }
  }
`