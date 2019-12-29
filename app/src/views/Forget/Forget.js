import React, { PureComponent } from 'react'
import { View, StatusBar } from 'react-native'
import { Button, Text, Input } from 'react-native-elements'
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-fontawesome-pro'

import Loading from '../../components/Loading'

// GraphQL
import { withApollo } from 'react-apollo'

import { GENERATE_FA, RESET_PASSWORD } from './graphql/mutations'
import { CHECK_FA } from './graphql/queries'

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

    message: {
        color: '#fff', 

        marginLeft: 10,
        marginTop: 5
    },

    successText: {
        fontSize: 19,
        marginBottom: 5,
        marginTop: 15,
        color: '#fff',
        textAlign: 'center'
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

class Forget extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            code: '',
            password: '',
            showPassword: false,
            password_confirm: '',
            message: '',
            emailClean: undefined,
            codeValid: undefined,
            success: false,
            loading: false
        }
    }

    componentDidMount() {
        const { email } = this.props

        this.setState({
            email
        })
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

    async generateFA () {
        const { client } = this.props

        const response = await client.mutate({
            mutation: GENERATE_FA,
            variables: {
                email: this.state.email
            } 
        })

        if (response.data.generateFA.success) {
            this.setState({
                success: true,
                message: ''
            })
        } else {
            this.setState({
                message: response.data.generateFA.message
            })
        }
    }

    async checkCode() {
        const { client } = this.props

        const response = await client.query({
            query: CHECK_FA,
            variables: {
                code: this.state.code
            } 
        })

        if (response.data.checkFA.is_valid) {
            this.setState({ 
                showPassword: true,
                message: '' 
            })
        } else {
            this.setState({
                message: 'Le code n\'est pas valide.'
            })
        }
    }

    async resetPassword() {
        const { client } = this.props

        if (this.state.password != this.state.password_confirm) {
            this.setState({
                message: 'Les mots de passe ne correspondent pas.'
            })
        } 
        
        if (this.state.password.length < 6) {
            this.setState({
                message: 'Le mot de passe doit être composer de 6 caractères minimum.'
            })
        }

        if (this.state.password == this.state.password_confirm && this.state.password.length >= 6) {
            await client.mutate({
                mutation: RESET_PASSWORD,
                variables: {
                    password: this.state.password,
                    email: this.state.email
                } 
            })
    
            Actions.pop()
        }
    }

    render() {
        const { success, showPassword } = this.state
        return (
            <View style={styles.body}>
                <StatusBar barStyle="light-content" backgroundColor="#2d3436" />
                <Loading>
                    {!success && <View style={styles.container}>
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
                            {this.state.message ? <Text style={styles.message}>
                                {this.state.message}
                            </Text> : null}
                        </View>

                        <Button
                            disabled={!this.state.email}
                            disabledTitleStyle={{color: '#fff'}}
                            title="Envoyer"
                            type="clear"
                            titleStyle={{color: '#000'}}
                            style={[styles.btn, {backgroundColor: !this.state.email ? 'rgba(245, 245, 245, 0.4)' : '#fff', marginTop: 40}]}
                            onPress={() => {this.generateFA()}}
                        />
                    </View>}
                    {success && !showPassword && <View style={styles.container}>
                        <Text style={styles.successText}>
                            Un code vous a été envoyé à l'adresse {this.state.email}
                        </Text>

                        <View style={{marginTop: 30}}>
                            <Input
                                inputStyle={styles.input}
                                label='Code de vérification'
                                labelStyle={styles.label}
                                inputContainerStyle={{borderBottomWidth: 0, width: 380}}
                                onChangeText={(value) => {this.handleChange(value, 'code')}}
                                value={this.state.code}
                                maxLength={4}
                                autoFocus
                            />
                            {this.state.message ? <Text style={styles.message}>
                                {this.state.message}
                            </Text> : null}
                        </View>

                        <Button
                            disabled={!this.state.code}
                            disabledTitleStyle={{color: '#fff'}}
                            title="Vérifier"
                            type="clear"
                            titleStyle={{color: '#000'}}
                            style={[styles.btn, {backgroundColor: !this.state.code ? 'rgba(245, 245, 245, 0.4)' : '#fff', marginTop: 30}]}
                            onPress={() => {this.checkCode()}}
                        />
                    </View>}
                    {showPassword && <View style={styles.container}>
                        <View style={{marginTop: 15}}>
                            <Input
                                secureTextEntry
                                inputStyle={styles.input}
                                label='Mot de passe'
                                labelStyle={styles.label}
                                inputContainerStyle={{borderBottomWidth: 0, width: 380}}
                                onChangeText={(value) => {this.handleChange(value, 'password')}}
                                value={this.state.password}
                                autoFocus
                            />
                            {this.state.message ? <Text style={styles.message}>
                                {this.state.message}
                            </Text> : null}
                        </View>

                        <View style={{marginTop: 15, marginBottom: 15}}>
                            <Input
                                secureTextEntry
                                inputStyle={styles.input}
                                label='Confirmer votre mot de passe'
                                labelStyle={styles.label}
                                inputContainerStyle={{borderBottomWidth: 0, width: 380}}
                                onChangeText={(value) => {this.handleChange(value, 'password_confirm')}}
                                value={this.state.password_confirm}
                            />
                        </View>

                        <Button
                            disabled={!this.state.password || !this.state.password_confirm}
                            disabledTitleStyle={{color: '#fff'}}
                            title="Mettre à jour"
                            type="clear"
                            titleStyle={{color: '#000'}}
                            style={[styles.btn, {backgroundColor: !this.state.password || !this.state.password_confirm ? 'rgba(245, 245, 245, 0.4)' : '#fff', marginTop: 15}]}
                            onPress={() => {this.resetPassword()}}
                        />
                    </View>}
                </Loading>
            </View>
        )
    }
}

export default withApollo(Forget)