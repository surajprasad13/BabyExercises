import styles from './styles';
import React, {Component} from 'react';
import {View, ScrollView, Switch} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from '@config/strings';
import Text from '@components/AppText';
import CommonDataManager from '@library/CommonDataManager';
//import RadialGradient from 'react-native-radial-gradient';
import OneSignal from 'react-native-onesignal';
import LinearGradient from 'react-native-linear-gradient';

export default class TermsAndConditionsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {accepted: false};
    const deviceLang = strings.getInterfaceLanguage().substring(0, 2); //Android gives en-US, iOS gives en
    strings.setLanguage(deviceLang);
    AsyncStorage.setItem('SelectedLanguage', JSON.stringify({iso: deviceLang}));
    OneSignal.sendTag('lang', deviceLang);
    CommonDataManager.getInstance().setSelectedLanguage({iso: deviceLang});
  }

  async onSwitch() {
    this.setState({accepted: true});
    AsyncStorage.setItem('termsAccepted', JSON.stringify(true));
    this.props.acceptTerms();
  }

  render() {
    return (
      // <RadialGradient
      //   style={{flex: 1, paddingBottom: 20}}
      //   colors={['rgb(199,129,156)', 'rgb(129,206,219)']}
      //   center={[0, 0]}
      //   radius={500}>

      <LinearGradient
        colors={['rgb(199,129,156)', 'rgb(129,206,219)']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={{flex: 1, paddingBottom: 20}}>
        <ScrollView style={styles.container} scrollIndicatorInsets={{right: 1}}>
          <View style={styles.innerContainer}>
            <View style={styles.border}>
              <View style={styles.header}>
                <Text style={styles.title}>{strings.terms}</Text>
              </View>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.paragraphs}>{strings.termsText}</Text>
            </View>
            <Text style={{color: 'white'}}>{strings.termsAccept}</Text>
            <Switch
              style={styles.switch}
              onValueChange={() => this.onSwitch()}
              value={this.state.accepted}
            />
          </View>
        </ScrollView>
      </LinearGradient>
      // </RadialGradient>
    );
  }
}
