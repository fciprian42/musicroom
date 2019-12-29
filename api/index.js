import express from 'express'
import cors from 'cors'
import { ApolloServer, PubSub } from 'apollo-server-express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { Client } from 'pg'
import path from 'path'

import routes from './src/routes'
import config from './src/config'
import schema from './src/graphql/schema'
import isLoggedIn from './src/utils/jwt'

const app = express()
const server = createServer(app)

/**
 * Firebase
 */

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'musicroom',
    password: 'test',
    port: 5432,
})

client
    .connect()
    .then(() => console.log('Database connected ✅'))
    .catch(err => console.error('❌ ', err.stack))

/**
 * Cors & Options
 */

const corsOptions = {
  origin: '*',
  credentials: true
};

const options = {
    port: process.env.PORT || 4000,
    endpoint: '/graphql'
}

app.use(express.static(path.join(__dirname, '/public')))
app.set('views', __dirname + '/public')
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cookieParser())

/**
 * Apollo
 */

const pushSubscriptions = new PubSub()

const apollo = new ApolloServer({ 
    schema,
    context: async ({ req, connection }) => {
        if (connection) {
            return {
                ...connection.context,
                pushSubscriptions
            }
        } else {
            const token = req.headers.authorization || ''

            const currentUser = await isLoggedIn(token)

            return {
                database,
                client,
                currentUser,
                pushSubscriptions,
                config
            }
        }
    },
    playground: true,
    introspection: true
})

apollo.applyMiddleware({ app, cors: true })
apollo.installSubscriptionHandlers(server)

server.listen(options.port, () => {
    routes(app)
})