import gql from 'graphql-tag'

export const GET_CURRENT_USER = gql`
    query User {
        getCurrentUser {
            id
            email
            first_name
            last_name
            picture
            is_oauth
            is_premium
            is_verified
            music_tags
        }
    }
`