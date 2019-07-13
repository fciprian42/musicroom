import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {
    GraphQLString as String,
    GraphQLNonNull as NonNull,
    GraphQLInt as Number,
    GraphQLBoolean as Boolean
} from 'graphql'

const { User } = require('../../../models')

export const signup = {
    type: String,
    description: '',
    args: {
        username: { type: new NonNull(String) },
        password: { type: new NonNull(String) },
        email: { type: new NonNull(String) },
    },
    resolve: async (obj, args, context, info) => {
        const { username, password, email } = args

        return User.findOrCreate({where: { username: username, email: email }, defaults: { password: await bcrypt.hash(password, 10) }})
            .then(([user, created]) => {
                if (created) return jsonwebtoken.sign({ id: user.id }, 'ilovescotchyscotch', {})

                if (user) return 'username or email already taken'
            })
    }
}

export const login = {
    type: String,
    description: '',
    args: {
        username: { type: new NonNull(String) },
        password: { type: new NonNull(String) },
    },
    resolve: async (_, args) => {
        const { username, password } = args

        const user = await User.findOne({ where: { username } })

        if (user) {
            const valid = await bcrypt.compare(password, user.password)

            if (valid) return jsonwebtoken.sign({ id: user.id }, 'ilovescotchyscotch', {})

            return 'Incorrect password'
        }

        return 'Account not found'
    }
}

export const deleteUser = {
    type: Boolean,
    description: 'Delete a user',
    args: {
        id: { type: new NonNull(Number) }
    },
    resolve: async (_, args, context, info) => {
        const { id } = args

        if (!context.user) return null

        return await User.destroy({ where: { id } })
    }
}

export const updateUser = {

}