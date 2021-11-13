import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';

//import RadialGradient from 'react-native-radial-gradient';
import LinearGradient from 'react-native-linear-gradient';

export default class Loading extends Component {
  render() {
    return (
      // <RadialGradient style={{ flex: 1 }}
      //     colors={['rgb(199,129,156)', 'rgb(129,206,219)']}
      //     center={[0, 0]}
      //     radius={500}>

      <LinearGradient
        colors={['rgb(199,129,156)', 'rgb(129,206,219)']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={{flex: 1, padding: 20}}>
        <ActivityIndicator />
      </LinearGradient>
      // </RadialGradient>
    );
  }
}
