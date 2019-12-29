import React, { PureComponent } from 'react'
import { View, StatusBar } from 'react-native'
import { Button, Text, Input, Overlay } from 'react-native-elements'

import Loading from '../../components/Loading'

// GraphQL
import { withApollo } from 'react-apollo'

import { SIGN_UP } from './graphql/mutations'

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

class Signup extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            isVisible: false,
            send: false,
            email: {
                value: '',
                message: ''
            },
            password: {
                value: '',
                message: ''
            },
            password_confirm: {
                value: ''
            }
        }
    }

    handleChange = (text, name) => {    
        this.setState({
            [name]: {
                ...this.state[name],
                value: text
            },
        })
    }

    async signUp () {
        const { client } = this.props
        const { email, password, password_confirm } = this.state
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        let error = false

        if (reg.test(email.value) === false) {
            error = true
            this.setState({
                email: {
                    ...this.state.email,
                    message: 'Le format n\'est pas valide'
                }
            })
        } else {
            error = false
            this.setState({
                email: {
                    ...this.state.email,
                    message: ''
                }
            })
        }

        if (password.value.length < 6) {
            error = true
            this.setState({
                password: {
                    ...this.state.password,
                    message: 'Votre mot de passe doit contenir au moins 6 caractères'
                }
            })
        } else {
            error = false
            this.setState({
                password: {
                    ...this.state.password,
                    message: ''
                }
            })
        }

        if (password.value != password_confirm.value) {
            error = true
            this.setState({
                password_confirm: {
                    ...this.state.password_confirm,
                    message: 'Les mot de passe ne correspondent pas'
                },

            })
        } else {
            error = false
            this.setState({
                password_confirm: {
                    ...this.state.password_confirm,
                    message: ''
                }
            })
        }

        if (!error) {
            const users = await client.mutate({
                mutation: SIGN_UP,
                variables: {
                    email: this.state.email.value,
                    password: this.state.password.value
                } 
            })
    
            if (users.data.signup) {
                this.props.navigation.navigate('SignupSuccess', { email: this.state.email.value })
            } else {
                this.setState({
                    error: "Cette adresse e-mail est déjà utilisé"
                })
            }
        }
    }

    _checkInputs = () => {
        return (<View style={styles.container}>
            <View style={{marginBottom: 15}}>
                <Input
                    inputStyle={styles.input}
                    label='Quelle est votre adresse e-mail ?'
                    labelStyle={styles.label}
                    inputContainerStyle={{borderBottomWidth: 0, width: 380}}
                    onChangeText={(text) => this.handleChange(text, 'email')}
                    value={this.state.email.value}
                />
                {this.state.email.message ? <Text style={{color: '#fff', opacity: .8, marginLeft: 10}}>
                    {this.state.email.message}
                </Text> : <Text style={{color: '#fff', opacity: .8, marginLeft: 10}}>
                    Vous devrez confirmer cette adresse e-mail par la suite.
                </Text>}
            </View>

            <View style={{marginBottom: 15}}>
                <Input
                    secureTextEntry
                    inputStyle={styles.input}
                    label='Votre mot de passe'
                    labelStyle={styles.label}
                    inputContainerStyle={{borderBottomWidth: 0, width: 380}}
                    onChangeText={(text) => this.handleChange(text, 'password')}
                    value={this.state.password.value}
                />
                {this.state.password.message ? <Text style={{color: '#fff', opacity: .8, marginLeft: 10}}>
                    {this.state.password.message}
                </Text> : null}
            </View>

            <View style={{marginBottom: 15}}>
                <Input
                    secureTextEntry
                    inputStyle={styles.input}
                    label='Confirmer votre mot de passe'
                    labelStyle={styles.label}
                    inputContainerStyle={{borderBottomWidth: 0, width: 380}}
                    onChangeText={(text) => this.handleChange(text, 'password_confirm')}
                    value={this.state.password_confirm.value}
                />
            </View>

            <Button
                disabled={
                    !this.state.email.value ||
                    !this.state.password.value ||
                    !this.state.password_confirm.value ||
                    this.state.password.value != this.state.password_confirm.value
                }
                disabledTitleStyle={{color: '#fff'}}
                title="Créer mon compte"
                type="clear"
                titleStyle={{color: '#000'}}
                style={[styles.btn, {backgroundColor: 
                    !this.state.email.value ||
                    !this.state.password.value ||
                    !this.state.password_confirm.value ||
                    this.state.password.value != this.state.password_confirm.value
                    ? 'rgba(245, 245, 245, 0.4)' : '#fff', marginTop: 40}]}
                onPress={() => {this.signUp()}}
            />
        </View>)
    }

    render() {
        return (
            <View style={styles.body}>
                <StatusBar barStyle="light-content" backgroundColor="#2d3436" />
                <Loading>
                    <View>
                        { this._checkInputs() }
                        <Overlay
                            isVisible={this.state.isVisible}
                            windowBackgroundColor="rgba(0, 0, 0, .8)"
                            overlayBackgroundColor="white"
                            width={360}
                            height="auto"
                            overlayStyle={styles.overlay}
                            onBackdropPress={() => {this.setState({isVisible: false})}}
                        >
                            <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center'}}>Cette adresse e-mail est déjà utilisée</Text>
                                <Text style={{textAlign: 'center', marginBottom: 30}}>Souhaitez-vous plutôt vous connecter ?</Text>
                                <Button
                                    title='Se connecter'
                                    type='clear'
                                    buttonStyle={[styles.btn ,{padding: 10, backgroundColor: 'rgba(130, 45, 201, .7)', borderWidth: 1, borderColor: 'rgb(130,45,201)'}]}
                                    titleStyle={{color: '#fff', textTransform: 'uppercase'}}
                                />
                                <Button
                                    title='Ignorer'
                                    type='clear'
                                    titleStyle={{color: '#000', textTransform: 'uppercase'}}
                                    onPress={() => {this.setState({isVisible: false})}}
                                />
                            </View>
                        </Overlay>
                    </View>
                </Loading>
            </View>
        )
    }
}

export default withApollo(Signup)