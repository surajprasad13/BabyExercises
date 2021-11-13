import React, {Component} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateFocus} from 'react-navigation-is-focused-hoc';

import {StackNavigator} from 'react-navigation';
import HomeScreen from '@screens/HomeScreen';
import TextAndImageScreen from '@screens/TextAndImageScreen';
import SupportScreen from '@screens/SupportScreen';
import CategoryScreen from '@screens/CategoryScreen';
import TextScreen from '@screens/TextScreen';
import VideoScreen from '@screens/VideoScreen';
import SplashScreen from '@screens/SplashScreen';
import TermsAndConditionsScreen from '@screens/TermsAndConditionsScreen';
import RecommendScreen from '@screens/RecommendScreen';
import VideoPlayerScreen from '@screens/VideoPlayerScreen';
import strings from '@config/strings';
import OneSignal from 'react-native-onesignal';
import CommonDataManager from '@library/CommonDataManager';
import Data from '@library/data';
import Events from '@library/events';

import * as Sentry from '@sentry/react-native';

// Sentry.config('https://3debc44ec11d4821a4eece1dc3ec7228@o151116.ingest.sentry.io/1202209').install();

Sentry.init({
  enableNative: false,
  dsn: 'https://3debc44ec11d4821a4eece1dc3ec7228:22d6907b6fa5438dbda1650efac77d70@sentry.io/1202209',
});

global.events = new Events();

const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    TextAndImage: {
      screen: TextAndImageScreen,
    },
    Support: {
      screen: SupportScreen,
    },
    Category: {
      screen: CategoryScreen,
    },
    Text: {
      screen: TextScreen,
    },
    Video: {
      screen: VideoScreen,
    },
    Recommend: {
      screen: RecommendScreen,
    },
    VideoPlayer: {
      screen: VideoPlayerScreen,
    },
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      header: null,
    },
  },
);

export default class Navigator extends Component {
  state = {
    isLoading: true,
    termsAccepted: false,
  };

  /**
   * Gets the languages
   *
   * @memberof Navigator
   */
  componentWillMount() {
    OneSignal.setLocationShared(false);
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId('18e6b319-389c-48a1-988c-3063dfeca630');
    this.setup();
  }

  async setup() {
    const terms = await AsyncStorage.getItem('termsAccepted');
    this.setState({termsAccepted: JSON.parse(terms)});

    try {
      //Get languages
      Data.getLanguages().then(data => {
        this.setState({
          languages: data.languages,
        });
        this.setInitialLanguage();
      });
    } catch (error) {
      console.log(error);
      Sentry.captureMessage(error);
      Alert.alert(strings.error, strings.errorMsg);
    }
  }

  componentDidMount() {
    //OneSignal.setNotificationWillShowInForegroundHandler(this.onReceived);
    //OneSignal.setInAppMessageClickHandler(this.onOpened);
    //OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    //OneSignal.clearHandlers();
  }

  // onReceived(notification) {
  //   console.log('Notification received: ', notification);
  // }

  // onOpened(openResult) {
  //   console.log('Message: ', openResult.notification.payload.body);
  //   console.log('Data: ', openResult.notification.payload.additionalData);
  //   console.log('isActive: ', openResult.notification.isAppInFocus);
  //   console.log('openResult: ', openResult);
  // }

  // async onIds(device) {
  //   console.log('Device info: ', device);
  // }

  /**
   * Gets selected language from Async storage and sets it.
   *
   * @memberof Navigator
   */
  setInitialLanguage() {
    try {
      AsyncStorage.getItem('SelectedLanguage').then(value => {
        if (value == null) {
          //Initial
          value = JSON.stringify(
            this.state.languages.find(x => x.iso === 'en'),
          );
        }
        let selected = JSON.parse(value);
        CommonDataManager.getInstance().setSelectedLanguage(selected);
        this.setState({
          isLoading: false,
        });
      });
    } catch (error) {
      Alert.alert(strings.error, strings.errorMsg);
      Sentry.captureMessage(error);
    }
  }

  /**
   * Terms accepted
   *
   * @memberof Navigator
   */
  acceptTerms() {
    this.setState({termsAccepted: true});
  }

  /**
   * Render appropiate screen
   *
   * @returns
   * @memberof Navigator
   */
  render() {
    if (this.state.isLoading) {
      return <SplashScreen />;
    }

    if (!this.state.termsAccepted) {
      return (
        <TermsAndConditionsScreen acceptTerms={this.acceptTerms.bind(this)} />
      );
    }

    return (
      <RootStack
        onNavigationStateChange={(prevState, currentState) => {
          updateFocus(currentState);
        }}
      />
    );
  }
}
