import React, { Component } from 'react';
import {
    PropTypes,
    StyleSheet,
    View,
    ActivityIndicator
} from 'react-native';

import RadialGradient from 'react-native-radial-gradient';
import Text from '@components/AppText';




export default class Loading extends Component {
    render() {
        return (
                <RadialGradient style={{ flex: 1 }}
                    colors={['rgb(199,129,156)', 'rgb(129,206,219)']}
                    center={[0, 0]}
                    radius={500}>

                    <View style={{ flex: 1, padding: 20 }}>
                        <ActivityIndicator />
                    </View>
                </RadialGradient>
        )
    }
}

