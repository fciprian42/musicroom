import { GraphQLSchema, GraphQLObjectType } from 'graphql'

import { getUsers, getUser, getSession } from './queries/users.query.gql'
import { signup, login, deleteUser } from './mutations/users.mutation.gql'

const query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        getUsers, getUser, getSession
    })
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        signup, login, deleteUser
    })
});
  
const schemaGraphQL = new GraphQLSchema({
    query: query,
    mutation: mutation
});

export default schemaGraphQL