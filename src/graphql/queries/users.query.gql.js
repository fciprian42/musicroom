import { AuthenticationError } from 'apollo-server-express'
import { 
    GraphQLList as List,
    GraphQLInt as Number,
    GraphQLNonNull as NonNull
 } from 'graphql'
 
import UsersType from '../types/users.types.gql'

import { User } from '../../../models'

export const getUsers = {
    type: List(UsersType),
    description: 'Get all users',
    args: {},
    resolve: async (_, args, context, info) => {
        if (!context.user) throw new AuthenticationError('must authenticate')

        return await User.findAll()
    }
}

export const getUser = {
    type: UsersType,
    description: 'Get user by id',
    args: {
        id: { type: new NonNull(Number)}
    },
    resolve: async (_, args, context, info) => {
        const { id } = args

        if (!context.user) throw new AuthenticationError('must authenticate')

        return await User.findByPk(id)
    }
}

export const getSession = {
    type: UsersType,
    description: 'Get the user session',
    resolve: async (_, args, context, info) => {
        if (!context.user) throw new AuthenticationError('must authenticate')

        return await User.findByPk(context.user.id)
    }
}