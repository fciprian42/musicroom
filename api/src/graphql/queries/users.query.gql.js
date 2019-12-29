import { AuthenticationError } from 'apollo-server-express'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import GraphQLJSON from 'graphql-type-json'
import { 
    GraphQLList as List,
    GraphQLString as String,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as Boolean
} from 'graphql'
import UsersType from '../types/users.types.gql'
import knex from '../knex'

/**
 * Users
 */

export const getUsers = {
    type: List(UsersType),
    description: 'Get all users',
    resolve: async (_, args, context, info) => {
        return await knex.select().table('users')
    }
}

export const getUser = {
    type: UsersType,
    description: 'Get user by id',
    args: {
        email: { type: String },
    },
    resolve: async (_, args, context, info) => {
        const { email } = args
    
        const user = await knex
            .select()
            .table('users')
            .where('email', email)
        
        if (!user[0]) return null

        return user[0]
    }
}

export const getCurrentUser = {
    type: UsersType,
    description: 'Get the user session',
    resolve: async (_, args, context, info) => context.currentUser
}

/**
 * Codes
 */

export const checkFA = {
    type: GraphQLJSON,
    description: 'Check codeFa',
    args: {
        code: { type: new NonNull(String) }
    },
    resolve: async (_, args, context, info) => {
        const { code } = args
        console.log(code)
        
        const checking = await knex('users').where('code_fa', code)

        if (checking && checking[0]) {
            return { is_valid: true }
        }

        return { is_valid: false }
    }
}

/**
 * Auth
 */

export const login = {
    type: GraphQLJSON,
    description: 'Log-in a user',
    args: {
        email: { type: String },
        password: { type: String }
    },
    resolve: async (_, args, context, info) => {
        const { email, password } = args 

        if (context.user) throw new AuthenticationError('already authenticate')
        
        const user = await knex('users').where('email', email)

        if (user && user[0]) {
            if (!user[0].password)
                return { error: true, code: 'userIsOauth' }

            const valid = await bcrypt.compare(password, user[0].password)

            if (!valid)
                return { error: true, code: 'badPassword' }

            if (!user[0].is_verified)
                return { error: true, code: 'emailNotVerified' }

            const token = jsonwebtoken.sign({id: user[0].id}, 'ilovescotchyscotch', {})

            jsonwebtoken.sign({id: user[0].id}, 'ilovescotchyscotch', {})

            return { success: true, code: 'successLogin', user: user[0], token }
        }

        return { error: true, code: 'userDontExist' }
    }
}