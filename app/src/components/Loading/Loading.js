import React, { PureComponent } from 'react'
import { View } from 'react-native'

import ActivityIndicator from 'react-native-activity-indicator'

const styles = {
    container: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
}

class Loading extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loading: false
            })
        }, 700)
    }

    render() {
        const { color, size } = this.props
        const { loading } = this.state

        if (loading) {
            return (<View style={styles.container}>
                <ActivityIndicator
                    animating
                    color={color}
                    duration={700}
                    size={size}
                />
            </View>)
        }

        return this.props.children
    }
}

Loading.defaultProps = {
    color: '#fff',
    size: 'large'
}

export default Loading