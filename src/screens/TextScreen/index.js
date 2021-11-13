import styles from './styles';
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import MenuDrawer from '@components/MenuDrawer';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc'
import strings from '@config/strings';
import Text from '@components/AppText';
import Data from '@library/data';
import CommonDataManager from '@library/CommonDataManager';
import DeviceInfo from 'react-native-device-info';
import renderIf from '@tools/renderIf';
import * as Sentry from '@sentry/react-native';


class TextScreen extends Component {

  constructor(props) {
    super(props);
    this.state = { isLoading: true }
  }

  UNSAFE_componentWillMount() {
    const { state } = this.props.navigation;
    try {
      Data.getPage(CommonDataManager.getInstance().getSelectedLanguage().iso, state.params.page_id).then(data => {
        this.setState({
          page: data.pages,
          isLoading: false,
        });
      });
    }
    catch (error) { Sentry.captureMessage(error); }
  }

  render() {

    if (this.state.isLoading) {
      return (
        <ActivityIndicator />
      )
    }

    return (
      <MenuDrawer>
        <ScrollView style={styles.container} 
            scrollIndicatorInsets={{right: 1}}>
        <View style={styles.innerContainer}>
          <View style={styles.border}>
            <View style={styles.header}>
              <Text style={styles.title}>{this.state.page.title}</Text>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.headline}>{this.state.page.headline}</Text>
            <Text style={styles.paragraphs}>{this.state.page.text}</Text>

            {renderIf(this.state.page.support,
                <View style={styles.deviceInfo}>
                <Text style={{color:'white'}}>App v. {DeviceInfo.getReadableVersion()}</Text>
                <Text style={{color:'white'}}>OS: {DeviceInfo.getSystemName()} {DeviceInfo.getSystemVersion()} </Text>
                <Text style={{color:'white'}}>UID: {DeviceInfo.getUniqueId()} </Text>
                <Text style={{color:'white'}}>DID: {DeviceInfo.getDeviceId()}</Text>
              </View>
            )}          
          </View>
          </View>
        </ScrollView>
      </MenuDrawer>

    );
  }



}



export default withNavigationFocus(TextScreen)
