import styles from './styles';
import React, {Component} from 'react';
import {View, Text, ActivityIndicator, Image} from 'react-native';
import AppText from '@components/AppText';

import strings from '@config/strings';

export default class SplashScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../../../assets/big_baby/Baby_icon_hero-LK.png')}
          style={styles.baby}
        />
        <AppText style={styles.text}>{strings.appTitle}</AppText>
      </View>
    );
  }
}
