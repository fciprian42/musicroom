import React, { PureComponent } from 'react'
import { ApolloClient } from 'apollo-boost'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { configureFontAwesomePro } from 'react-native-fontawesome-pro'
import { WebSocketLink } from 'apollo-link-ws'
import { ApolloProvider } from 'react-apollo'
import { getMainDefinition } from 'apollo-utilities'
import { Provider } from 'react-redux'
import * as SecureStore from 'expo-secure-store'
import reducer from './src/store/reducers'
import { onError } from 'apollo-link-error'

import App from './src/App'

import simpleMiddleWare from './src/store/middleware/index'

/**
 * Apollo Config
 */

const httpLink = new HttpLink({
  uri: "http://TON-IPV4:4000/graphql",
  credentials: 'same-origin'
})

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message))
})

const wsLink = new WebSocketLink({
  uri: `ws://TON-IPV4:4000/graphql`,
  options: {
    reconnect: true
  }
})

const authLink = setContext(async (req, { headers }) => {
  const token = await SecureStore.getItemAsync('token')

  return {
    ...headers,
    headers: {
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

const link = split( 
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink,
  errorLink
)

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache()
})

/**
 * Store
 */

const configureStore = (reducer) => createStore(
  combineReducers({
    user: reducer.user
  }),
  applyMiddleware(simpleMiddleWare(), thunk)
)

const store =  configureStore(reducer)

/**
 * React Native App
 */

configureFontAwesomePro('light')
configureFontAwesomePro('solid')

class MusicRoom extends PureComponent {
  render() {
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <App />
        </Provider>
      </ApolloProvider>
    )
  }
}

export default MusicRoom