import { Actions } from 'react-native-router-flux'
import * as SecureStore from 'expo-secure-store'

const simpleMiddleWare = () => ({ dispatch }) => {
  return next => action => {
    return SecureStore.getItemAsync('token', {}).then(token => {
      if (token && (Actions.currentScene === 'login' || Actions.currentScene === 'singup')) Actions.push('dashboard')

      if (Actions.currentScene === 'dashboard' && !token) return Actions.push('home')

      return next(action)
    })
  }
}

export default simpleMiddleWare