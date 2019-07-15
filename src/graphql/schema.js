import { GraphQLSchema, GraphQLObjectType } from 'graphql'

import { getUsers, getUser, getMe } from './queries/users.query.gql'
import { signup, login, deleteUser, updateUser } from './mutations/users.mutation.gql'

const query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        getUsers, getUser, getMe
    })
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        signup, login, deleteUser, updateUser
    })
});
  
const schemaGraphQL = new GraphQLSchema({
    query: query,
    mutation: mutation
});

export default schemaGraphQL