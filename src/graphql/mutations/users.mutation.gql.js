import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import { AuthenticationError } from 'apollo-server-express'
import {
    GraphQLString as String,
    GraphQLNonNull as NonNull,
    GraphQLInt as Number,
    GraphQLBoolean as Boolean
} from 'graphql'

import UsersType from '../types/users.types.gql'
import knex from '../knex'

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
        const token = Math.random().toString(36).substr(2)

        /*return context.query.User.findOrCreate({where: { username: username, email: email }, defaults: { password: await bcrypt.hash(password, 10), token, isVerified: false }})
            .then(([user, created]) => {
                if (created) {
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                          user: context.config.mail.user,
                          pass: context.config.mail.password
                        }
                    });

                    transporter.sendMail({
                        from: email,
                        to: context.config.mail.user,
                        subject: 'Confirmation',
                        text: 'test',
                        html: "<b>Hello world?</b>"
                    });

                    return jsonwebtoken.sign({ id: user.id }, 'ilovescotchyscotch', {})
                }

                if (user) return 'username or email already taken'
            })*/
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

        const user = await knex('users').where('username', username)

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

        if (!context.user) throw new AuthenticationError('must authenticate')

        return await knex('users').where('id', id).del()
    }
}

export const updateUser = {
    type: UsersType,
    description: 'Update user information',
    args: {
        email: { type: String },
        username: { type: String },
        biography: { type: String },
        first_name: { type: String },
        last_name: { type: String }
    },
    resolve: (_, args, context, info) => {
        if (!context.user) throw new AuthenticationError('must authenticate')

        return knex('users')
            .where('id', context.user.id)
            .update(args)
            .then((res) => {
                if (res) {
                    context.user = res.dataValues
                    return res.dataValues
                }

                return context.user
            })
    }
}

export const setPremium = {
    type: Boolean,
    description: 'Set the status "premium" to a user',
    resolve: async (_, args, context, info) => {
        if (!context.user) throw new AuthenticationError('must authenticate')

        return knex('users')
            .where('id', context.user.id)
            .update({ is_premium: true })
            .then((res) => {
                if (res) {
                    console.log(res.dataValues)
                    //context.user = res.dataValues
                    return true
                }
            
                return false
            })
    }
}

export const generateCodeFa = {
    type: Boolean,
    resolve: async (_, args, context, info) => {
        const codeFa = Math.floor(1000 + Math.random() * 9000)

        if (!context.user) throw new AuthenticationError('must authenticate')

        if (!context.user.codeFa) {
            await knex('users')
                .where('id', context.user.id)
                .update({ codeFa })
                .then(() => {
                    context.user.codeFa = codeFa
                })

            // With send the SMS

            return true
        }

        return false
    }
}

export const resetPassword = {
    type: Boolean,
    args: {
        codeFa: { type: new NonNull(Number) },
        newPassword: { type: new NonNull(String) }
    },
    resolve: async (_, args, context, info) => {
        const { codeFa, newPassword } = args

        if (!context.user) throw new AuthenticationError('must authenticate')

        if (context.user.codeFa) {
            if (codeFa === context.user.codeFa) {
                const password = await bcrypt.hash(newPassword, 10)

                await knex('users')
                    .where('id', context.user.id)
                    .update({ codeFa: null , password})
                    .then(() => {
                        context.user.codeFa = null
                    })

                return false
            }
        }

        return false
    }
}