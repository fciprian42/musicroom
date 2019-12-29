import React, { PureComponent } from 'react'
import { Router, Scene, Stack } from 'react-native-router-flux'
import Icon from 'react-native-fontawesome-pro'

// Views
import Home from './views/Home'
import Signup from './views/Signup'
import Login from './views/Login'
import Forget from './views/Forget'
import DashBoard from './views/DashBoard'
import Profile from './views/Profile'
import SignupSuccess from './views/SignupSuccess'

class App extends PureComponent {
  render() {
    return (
      <Router>
        <Stack key='root'>
          <Scene 
            key='home' 
            component={Home} 
            hideNavBar 
            navigationBarStyle={{
              backgroundColor: '#822DC9',
              borderBottomWidth: 0
            }} 
          />
          <Scene key='dashboard' component={DashBoard} hideNavBar />
          <Scene 
            key='profile' 
            component={Profile} 
            back={true}
            navigationBarStyle={{
              backgroundColor: '#3d3d3d',
              borderBottomWidth: 0
            }}
            renderLeftButton={
              <Icon 
                name='chevron-left' 
                type='light'
                size={18}
                iconStyle={{marginLeft: 10}}
              />
            }
            hideNavBar={false}
            backButtonTintColor='white'
          />
          <Scene 
            key='signup' 
            component={Signup} 
            navigationBarStyle={{
              backgroundColor: '#822DC9',
              borderBottomWidth: 0,
            }}
            backButtonTintColor='white'
            hideNavBar={false}
            back={true}
            title='Créer un compte'
            titleStyle={{
              color: '#fff', 
              fontSize: 21
            }}
            renderLeftButton={
              <Icon 
                name='chevron-left' 
                type='light'
                size={18}
                iconStyle={{marginLeft: 10}}
              />
            }
          />
          <Scene 
            key='login' 
            component={Login} 
            navigationBarStyle={{
              backgroundColor: '#822DC9',
              borderBottomWidth: 0,
            }}
            backButtonTintColor='white'
            hideNavBar={false}
            back={true}
            title='Se connecter'
            titleStyle={{
              color: '#fff', 
              fontSize: 21
            }}
            renderLeftButton={
              <Icon 
                name='chevron-left' 
                type='light'
                size={18}
                iconStyle={{marginLeft: 10}}
              />
            }
          />
          <Scene 
            key='forget' 
            component={Forget} 
            navigationBarStyle={{
              backgroundColor: '#822DC9',
              borderBottomWidth: 0,
            }}
            backButtonTintColor='white'
            hideNavBar={false}
            back={true}
            title='Récupération'
            titleStyle={{
              color: '#fff', 
              fontSize: 21
            }}
            renderLeftButton={
              <Icon 
                name='chevron-left' 
                type='light'
                size={18}
                iconStyle={{marginLeft: 10}}
              />
            }
          />
          <Scene key='signup_success' component={SignupSuccess} hideNavBar />
        </Stack>
      </Router>
    )
  }
}

export default App