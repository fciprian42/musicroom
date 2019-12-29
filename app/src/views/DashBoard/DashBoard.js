import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import { withApollo } from 'react-apollo'
import { Actions } from 'react-native-router-flux'

const styles = {
    container: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
}

class DashBoard extends PureComponent {
    render() {
        return (<View style={styles.container}>
          <Button title='Mon profil' onPress={() => {Actions.push('profile')}} />
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withApollo(DashBoard))