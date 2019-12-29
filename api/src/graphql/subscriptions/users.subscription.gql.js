import UsersType from '../types/users.types.gql'

export const onSignup = {
    type: UsersType,
    description: 'Return users count on signup user',
    subscribe: (_, __, { pushSubscriptions }) => {
        return pushSubscriptions.asyncIterator('new_user')
    }
}