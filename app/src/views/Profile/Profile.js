import React, { PureComponent } from 'react'
import { Text, View, Image, Button } from 'react-native'
import { withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import * as SecureStore from 'expo-secure-store'
import { Actions } from 'react-native-router-flux'

import Loading from '../../components/Loading'

/**
 * GraphQL
 */

import { GET_CURRENT_USER } from './graphql/queries'

const styles = {
    container: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3d3d3d'
    }
}

class Profile extends PureComponent {
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const { dispatch, client } = this.props

        const current_user = await client.query({
            query: GET_CURRENT_USER
        })

        if (current_user && current_user.data) {
            dispatch({ type: 'login', data: current_user.data.getCurrentUser })
        }
    }

    render() {
        const { user } = this.props
        console.log(user)
        return (<View style={styles.container}>
            <Loading>
                {user.picture && <Image 
                    source={{ uri: user.picture }}
                    resizeMode="scale"
                    style={{width: 200, height: 200}}
                />}
                <Button 
                    title='Logout'
                    onPress={() => {
                        this.props.client.resetStore()
                        SecureStore.deleteItemAsync('token').then(() => {
                            Actions.push('home')
                        })
                    }}
                />
            </Loading>
        </View>)
    }
}

const mapStateToProps = state => {
    return {
      user: state.user
    }
}
  
const mapDispatchToProps = dispatch => {
  return { dispatch }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(withApollo(Profile))