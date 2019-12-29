import gql from 'graphql-tag'

export const GENERATE_FA = gql`
    mutation generateFA($email: String!) {
        generateFA(email: $email)
    }
`

export const RESET_PASSWORD = gql`
    mutation resetPassword($email: String!, $password: String!) {
        resetPassword(email: $email, password: $password)
    }
`