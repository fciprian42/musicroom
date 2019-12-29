import gql from 'graphql-tag'

export const LOGIN = gql`
    query login($email: String!, $password: String!) {
        login(email: $email, password: $password)
    }
`