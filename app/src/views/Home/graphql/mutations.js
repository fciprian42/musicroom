import gql from 'graphql-tag'

export const FACEBOOK_CREATE = gql`
    mutation facebookCreate($access_token: String!) {
        facebookCreate(access_token: $access_token)
    }
`