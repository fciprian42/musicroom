import React, { PureComponent } from 'react'
import Icon from 'react-native-fontawesome-pro'
import { View, StatusBar, Animated, Easing } from 'react-native'
import { Button, Text } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient'
import { Actions } from 'react-native-router-flux'
import { withApollo } from 'react-apollo'
import { AppLoading, AuthSession } from 'expo'
import * as Font from 'expo-font'
import { connect } from 'react-redux'
import * as SecureStore from 'expo-secure-store'

import Loading from '../../components/Loading'

// GraphQL
import { Query } from 'react-apollo'

import { USERS_SUBSCRIPTION } from './graphql/subscriptions'
import { GET_USERS } from './graphql/queries'
import { FACEBOOK_CREATE } from './graphql/mutations'

let unsubscribe = null

const styles = {
    body: {
        backgroundColor: '#2d3436',
        padding: 50,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent:'space-between',
    },

    hr: {
        borderWidth: 0.5,
        width: 100,
        borderColor: '#e6e6e6',
        margin: 10
    },
    
    topBanner: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    flex: {
        flexDirection: 'row'
    },

    logo: {
        color:'#fff',
        fontSize: 60,
        fontFamily: 'PoiretOne'
    },
    
    btn: {
        width: 200,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 40,
        color: '#fff',
        justifyContent: 'center',
        textAlign: 'center'
    },

    btnIcon: {
        width: 50,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 40,
        color: '#fff',
        justifyContent: 'center',
        textAlign: 'center'
    }
}

class Home extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            fontLoaded: false,
            user: null,
            fadeAnim: new Animated.Value(0),
            pulseAnim: new Animated.Value(16),
            moveAnimation: new Animated.ValueXY({ x: 0, y: -200})
        };
    }

    _moveLogo = () => {
        Animated.spring(this.state.moveAnimation, {
          toValue: {x: 0, y: 10},
        }).start()
    }

    _pulseText = () => {
        Animated.sequence([
            Animated.timing(this.state.pulseAnim, {
                toValue: 19,
                easing: Easing.linear,
                duration: 250
            }),
            Animated.timing(this.state.pulseAnim, {
                toValue: 16,
                easing: Easing.linear,
                duration: 250
            })
        ]).start()
    }

    _resetAnimations = () => {
        this.state.fadeAnim.resetAnimation()
        this.state.moveAnimation.resetAnimation()

        this._moveLogo()
        Animated.timing(this.state.fadeAnim, {toValue: 1, duration: 1500}).start()
    }

    async componentDidMount() {
        const token = await SecureStore.getItemAsync('token')

        if (token) {
            Actions.dashboard()
        }

        await Font.loadAsync({
          'PoiretOne': require('../../../assets/fonts/PoiretOne.ttf')
        })

        setTimeout(() => {
            this._moveLogo()
        }, 800)

        this.setState({ fontLoaded: true })    
    }

    loginWithFacebook = async () => {
        const { client, dispatch } = this.props

        const redirectUrl = AuthSession.getRedirectUrl()
        const result = await AuthSession.startAsync({
            authUrl:
              'https://www.facebook.com/v3.1/dialog/oauth?response_type=token'
              + `&client_id=328004361271096`
              + `&redirect_uri=${encodeURIComponent(redirectUrl)}`,
        })

        if (result) {
            const user = await client.mutate({
                mutation: FACEBOOK_CREATE,
                variables: {
                    access_token: result.params.access_token
                } 
            })
            
            if (user) {
                dispatch({ type: 'login', data:  user.data.facebookCreate })
                SecureStore.setItemAsync('token', user.data.facebookCreate.token).then(() => {
                    Actions.push('dashboard')
                })
            }
        }
    }

    render() {
        const { fontLoaded } = this.state
        
        if (!fontLoaded) {
            return <AppLoading />
        }

        return (
            <View>
                <LinearGradient
                    colors={['#4E05F0', '#7777FF', '#822DC9']}
                    style={styles.body}
                    start={[0, 0]}
                    end={[1.5, 0.5]}
                >
                    <StatusBar barStyle="light-content" backgroundColor="#2d3436" />
                    <Loading>
                        <Animated.View style={this.state.moveAnimation.getLayout()}>
                            <Text style={styles.logo}>
                                musicroom
                            </Text>
                        </Animated.View>
                        <View style={styles.topBanner}>
                            <Text style={{fontSize: 28, color: '#fff', marginBottom: 5}}>
                                Joignez-vous à la fête.
                            </Text>
                            <Query query={GET_USERS}>
                                {({loading, data, subscribeToMore}) => {
                                    if (loading) {
                                        return null
                                    }

                                    let total = 0

                                    if (data && data.getUsers) {
                                        total = data.getUsers.length

                                        Animated.timing(this.state.fadeAnim, {toValue: 1, duration: 1500}).start()

                                        if (!unsubscribe) {
                                            unsubscribe = subscribeToMore({
                                                document: USERS_SUBSCRIPTION,
                                                updateQuery: (prev, { subscriptionData }) => {
                                                    if (!subscriptionData.data) return prev
                                                    
                                                    const { onSignup } = subscriptionData && subscriptionData.data
                                                    
                                                    this._pulseText()

                                                    return {
                                                        ...prev,
                                                        getUsers: [...prev.getUsers, onSignup]
                                                    }
                                                }
                                            })
                                        }
                                    }

                                    return (<Animated.Text style={{fontSize: 16, color: 'rgba(255, 255, 255, 0.9)', opacity: this.state.fadeAnim}}>
                                        <Animated.Text style={{fontSize: this.state.pulseAnim}}>{total}</Animated.Text> personnes font déjà la fête
                                    </Animated.Text>)
                                }}
                            </Query>
                        </View>
                        <View style={styles.container}>
                            <Button
                                title="S'inscrire"
                                type="clear"
                                titleStyle={{color: '#fff'}}
                                style={[styles.btn, {backgroundColor: 'rgba(245, 245, 245, 0.4)'}]}
                                onPress={() => Actions.push('signup')}
                            />
                            <Button
                                title="Se connecter"
                                type="clear"
                                titleStyle={{color: '#fff'}}
                                style={styles.btn}
                                onPress={() => Actions.push('login')}
                            />
                            <View style={styles.flex}>
                                <Button
                                    icon={<Icon 
                                        name='facebook-f' 
                                        color='white' 
                                        type='brands'
                                        size={24}
                                    />}
                                    type="clear"
                                    style={styles.btnIcon}
                                    onPress={() => this.loginWithFacebook()}
                                />
                            </View>
                        </View>
                    </Loading>
                </LinearGradient>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return { dispatch }
}

export default connect(null, mapDispatchToProps)(withApollo(Home))