import React, { PureComponent } from 'react'
import { View, StatusBar} from 'react-native'
import { Button, Text, Input } from 'react-native-elements'
import { connect } from 'react-redux'
import { withApollo } from 'react-apollo'
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-fontawesome-pro'
import * as SecureStore from 'expo-secure-store'


import Loading from '../../components/Loading'

import { LOGIN } from './graphql/queries'

const styles = {
    body: {
        backgroundColor: '#822DC9',
        padding: 15,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent:'space-between',
    },

    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#fff'
    },

    forget: {
        fontSize: 16,
        marginTop: 10,
        marginLeft: 10,
        textDecorationLine: 'underline',
        color: '#fff'
    },

    input: {
        position: 'relative',
        backgroundColor: 'rgba(245, 245, 245, 0.4)',
        padding: 10,
        width: 380,
        borderRadius: 4,
        color: '#fff'
    },

    overlay: {
        padding: 25
    },

    btn: {
        width: 300,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 40,
        justifyContent: 'center'
    }
}

class Login extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            message: '',
            emailClean: undefined,
            loading: false
        }
    }

    handleChange = (value, name) => {
        if (name == 'email') {
            const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

            this.setState({ emailClean: reg.test(value) })
        }

        this.setState({
            [name]: value
        })
    }

    async login () {
        const { client, dispatch } = this.props

        setTimeout(() => {
            this.setState({
                loading: true
            })
        }, 700)

        const login = await client.query({
            query: LOGIN,
            variables: {
                email: this.state.email,
                password: this.state.password
            } 
        })

        if (login.data.login.error) {
            let message = ''
            switch (login.data.login.code) {
                case 'userDontExist':
                    message = "Le mot de passe ou l'adresse e-mail n'est pas valide."
                    break
                case 'badPassword':
                    message = "Le mot de passe ou l'adresse e-mail n'est pas valide."
                    break
                case 'userIsOauth':
                    message = "Ce compte est associé à un compte social."
                    break
                case 'emailNotVerified':
                    message = "Veuillez valider votre compte par mail."
                    break
                default:
                    break
            }

            this.setState({
                email: '',
                password: '',
                emailClean: undefined,
                message,
                loading: false
            })
        } else {
            dispatch({ type: 'login', data: login.data.login })
            SecureStore.setItemAsync('token', login.data.login.token).then(() => {
                Actions.push('dashboard')
            })
        }
    }

    emailChecker = () => {
        const { emailClean } = this.state

        if (emailClean == false) {
            return (<Icon 
                name='times' 
                color='white' 
                type='light'
                size={18}
            />)
        } else if (emailClean == true) {
            return (<Icon 
                name='check' 
                color='white' 
                type='light'
                size={18}
            />)
        } else { 
            return null
        }
    }

    render() {
        return (
            <View style={styles.body}>
                <StatusBar barStyle="light-content" backgroundColor="#2d3436" />
                <Loading>
                    <View style={styles.container}>
                        <View style={{marginBottom: 15}}>
                            <Input
                                inputStyle={styles.input}
                                label='Adresse e-mail'
                                labelStyle={styles.label}
                                inputContainerStyle={{borderBottomWidth: 0, width: 380}}
                                onChangeText={(value) => this.handleChange(value, 'email')}
                                value={this.state.email}
                                rightIconContainerStyle={{margin: 0, position: 'absolute', right: 10, top: 1}}
                                rightIcon={this.emailChecker()}
                                autoFocus
                            />
                        </View>
                        <View style={{marginBottom: 15}}>
                            <Input
                                secureTextEntry
                                inputStyle={styles.input}
                                label='Mot de passe'
                                labelStyle={styles.label}
                                inputContainerStyle={{borderBottomWidth: 0, width: 380}}
                                onChangeText={(value) => this.handleChange(value, 'password')}
                                value={this.state.password}
                            />
                            <Text 
                                style={styles.forget} 
                                onPress={() => {
                                    Actions.push('forget', { email : this.state.email })
                                }}
                            >
                                J'ai oublié mon mot de passe
                            </Text>
                        </View>

                        {this.state.message ? <Text style={styles.label}>{this.state.message}</Text> : null }

                        <Button
                            disabled={!this.state.email || !this.state.password}
                            disabledTitleStyle={{color: '#fff'}}
                            title="Connexion"
                            type="clear"
                            titleStyle={{color: '#000'}}
                            style={[styles.btn, {backgroundColor: !this.state.email || !this.state.password ? 'rgba(245, 245, 245, 0.4)' : '#fff', marginTop: 40}]}
                            onPress={() => {this.login()}}
                        />
                    </View>
                </Loading>
            </View>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return { dispatch }
}

export default connect(null, mapDispatchToProps)(withApollo(Login))