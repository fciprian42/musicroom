import gql from 'graphql-tag'

export const CHECK_FA = gql`
    query checkFA($code: String!) {
        checkFA(code: $code)
    }
`