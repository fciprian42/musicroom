import gql from 'graphql-tag'

export const SIGN_UP = gql`
    mutation signup($email: String!, $password: String!) {
        signup(email: $email, password: $password)
    }
`