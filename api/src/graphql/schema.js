import { GraphQLSchema, GraphQLObjectType } from 'graphql'

import { getUsers, getUser, getCurrentUser, login, checkFA } from './queries/users.query.gql'
import { signup, facebookCreate, generateFA, resetPassword } from './mutations/users.mutation.gql'
import { onSignup } from './subscriptions/users.subscription.gql'

const query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        getUsers, getUser, getCurrentUser,
        login,
        checkFA
    })
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        signup, facebookCreate, generateFA, resetPassword
    })
});

const subscription =  new GraphQLObjectType({
    name: 'Subscription',
    fields: () => ({
        onSignup
    })
});
  
const schemaGraphQL = new GraphQLSchema({
    query: query,
    mutation: mutation,
    subscription: subscription
});

export default schemaGraphQL