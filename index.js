import express from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import io from 'socket.io'
import { Client } from 'pg'
import path from 'path'

import routes from './src/routes'
import config from './src/config'
import schema from './src/graphql/schema'
import isLoggedIn from './src/utils/jwt'

const app = express()
const server = createServer(app)
const socket = io(server)

const options = {
    port: process.env.PORT || 4000,
    endpoint: '/graphql'
}

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'musicroom',
    password: 'test',
    port: 5432,
})

client.connect()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cookieParser())

app.use(express.static(path.join(__dirname, '/public')))
app.set('views', __dirname + '/public')
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

socket.on('connection', function (socket) {
    console.log('hello')
})

const apollo = new ApolloServer({ 
    schema, 
    context: async ({ req }) => {
        const token = req.headers.authorization || ''
        
        const user = await isLoggedIn(token)

        return {
            client,
            user,
            config
        }
    },
    formatError: (err) => {
        if (err.message.startsWith("Database Error: ")) {
            return new Error('Internal server error')
        }

        return err
    }
})

apollo.applyMiddleware({ app })

server.listen(options.port, () => {
    console.log('🚀 ', `Server is running on http://localhost:${options.port}`);
    console.log(`You can access to the GraphiQL at http://localhost:${options.port}${apollo.graphqlPath}`);

    routes(app)
})