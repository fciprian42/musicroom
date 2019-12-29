import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import FB from 'fb'
import jsonwebtoken from 'jsonwebtoken'
import GraphQLJSON from 'graphql-type-json'
import {
    GraphQLString as String,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as Boolean
} from 'graphql'

import UsersType from '../types/users.types.gql'
import knex from '../knex'

export const signup = {
    type: Boolean,
    description: 'Signup a user',
    args: {
        email: { type: new NonNull(String) },
        password: { type: new NonNull(String) }
    },
    resolve: async (_, args, context, info) => {
        const { pushSubscriptions } = context
        const { email, password } = args

        const user = await knex
            .select()
            .table('users')
            .where('email', email)

        if (user && user[0]) return false

        const lastInsertId = await knex('users')
            .insert({ 
                email, 
                password: await bcrypt.hash(password, 10), 
                token: Math.random().toString(36).substr(2) 
            })
            .returning('id')

        const lastUserCreate = await knex('users')
            .where('id', lastInsertId[0])

        pushSubscriptions.publish('new_user', {
            onSignup: lastUserCreate[0]
        })

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: 'francoiscipriani@gmail.com',
              pass: 'Allerom50!!'
            }
        })

        transporter.sendMail({
            from: 'francoiscipriani@gmail.com',
            to: email,
            subject: 'Confirmation de votre compte',
            text: 'test',
            html: "<b>Hello world?</b>"
        })

        return true
    }
}

export const facebookLink = {
    type: GraphQLJSON,
    description: 'Link account from facebook',
    args: {
        access_token: { type: new NonNull(String) }
    },
    resolve: async (_, args, context, info) => {
        const { access_token } = args

        console.log(context)
    }
}

export const facebookCreate = {
    type: GraphQLJSON,
    description: 'Create account from facebook',
    args: {
        access_token: { type: new NonNull(String) }
    },
    resolve: async (_, args, context, info) => {
        const { access_token } = args
        const { pushSubscriptions } = context

        function fbAPI () {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    FB.api('me', { fields: 'id,name,email,first_name,last_name,picture.type(large)', access_token }, (async (res) => {
                        const user = await knex('users').where('email', res.email)

                        if (user && user[0]) {
                            if (user[0].is_oauth) {
                                const token = jsonwebtoken.sign({id: user[0].id}, 'ilovescotchyscotch', {})

                                jsonwebtoken.sign({id: user[0].id}, 'ilovescotchyscotch', {})
                                
                                resolve({ user: user[0], token })
                            } else {
                                // error
                            }
                        } else {
                            const user = {
                                email: res.email,
                                is_verified: true,
                                first_name: res.first_name,
                                last_name: res.last_name,
                                is_premium: false,
                                is_oauth: true,
                                password: null,
                                picture: res.picture.data.url
                            }

                            const lastInsertId = await knex('users')
                                .insert(user)
                                .returning('id')
                
                            const lastUserCreate = await knex('users')
                                .where('id', lastInsertId[0])
                
                            pushSubscriptions.publish('new_user', {
                                onSignup: lastUserCreate[0]
                            })

                            const token = jsonwebtoken.sign({id: lastInsertId[0]}, 'ilovescotchyscotch', {})

                            jsonwebtoken.sign({id: lastInsertId[0]}, 'ilovescotchyscotch', {})

                            resolve({ user, token })
                        }
                    }))    
                }, 0)
            });
        }
        
        let infos = await fbAPI();
       
        return infos
    }
}

/**
 * Codes
 */

export const generateFA = {
    type: GraphQLJSON,
    description: 'Generate code FA',
    args: {
        email: { type: new NonNull(String) }
    },
    resolve: async (_, args, context, info) => {
        const { email } = args

        const user = await knex('users').where('email', email)

        if (user && user[0]) {
            if (user[0].is_oauth) 
                return { error: true, message: 'Ce compte est associé à un réseau social.' }

            const code = Math.floor(1000 + Math.random() * 9000);
            
            await knex('users')
                .where('id', user[0].id)
                .update({ code_fa: code })

            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                user: 'francoiscipriani@gmail.com',
                pass: 'Allerom50!!'
                }
            })

            transporter.sendMail({
                from: 'francoiscipriani@gmail.com',
                to: email,
                subject: 'Récupération de mot de passe',
                text: 'Voici votre code de récupération : ' + code
            })

            return { success: true }
        }

        return { error: true, message: 'Ce compte n\'existe pas.' }
    }
}

/**
 * User
*/

export const resetPassword = {
    type: Boolean,
    description: 'Reset user password',
    args: {
        email: { type: new NonNull(String) },
        password: { type: new NonNull(String) }
    },
    resolve: async (_, args, context, info) => {
        const { email, password } = args

        const user = await knex('users').where('email', email)

        if (user && user[0]) {
            await knex('users')
                .where('id', user[0].id)
                .update({ password: await bcrypt.hash(password, 10) })

            return true
        }

        return false
    }
}