import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import { Text, Button } from 'react-native-elements'

const styles = {
    container: {
        height: '100%',
        display: 'flex',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#2ecc71',
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
        justifyContent: 'center'
    },

    text: {
        fontSize: 30,
        color: '#fff',
        marginBottom: 20,
    },

    text_small: {
        fontSize: 15,
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center'
    }
}

class SignupSuccess extends PureComponent {
    render() {
        const { navigation } = this.props

        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.text}>
                        Merci de votre inscription !
                    </Text>
                </View>
                <View>
                    <Text style={styles.text_small}>
                        Un mail vous a été envoyé à votre adresse <Text style={{fontWeight: 'bold'}}>francoiscipriani@gmail.com</Text> pour activer votre compte musicroom.
                    </Text>
                </View>
                <Button
                    title="Gotcha !"
                    type="clear"
                    titleStyle={{color: '#fff'}}
                    style={[styles.btn, {backgroundColor: 'rgba(245, 245, 245, 0.4)'}]}
                    onPress={() => navigation.navigate('Home')}
                />
            </View>
        )
    }
}

export default SignupSuccess