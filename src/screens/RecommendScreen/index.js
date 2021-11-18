import React from 'react';
import styles from './styles';
import {
  Dimensions,
  View,
  Image,
  Linking,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';

import {isTablet} from 'react-native-device-detection';
import strings from '@config/strings';

//import RadialGradient from 'react-native-radial-gradient';
import MenuDrawer from '@components/MenuDrawer';
import Header from '@components/Header';
import HeaderImageScrollView, {
  TriggeringView,
} from 'react-native-image-header-scroll-view';
import Text from '@components/AppText';
import Data from '@library/data';
import DeviceInfo from 'react-native-device-info';
import CommonDataManager from '@library/CommonDataManager';
import Orientation from 'react-native-orientation-locker';

import Config from '@config/Config';
import {Analytics, Hits as GAHits} from 'react-native-google-analytics';
import * as Sentry from '@sentry/react-native';
import LinearGradient from 'react-native-linear-gradient';

let ga = (this.ga = null);

class RecommendScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false, isLoading: true};
  }
  /**
   * Opens the navigation drawer
   * @memberof RecommendScreen
   */
  openDrawer = () => {
    this.setState({open: true});
  };
  /**
   * Opens the link from the recommendation
   * @memberof RecommendScreen
   */
  openLink = () => {
    let linkClick = new GAHits.ScreenView(
      'Baby Exercise App',
      'Anbefalings link klik',
    );
    ga.send(linkClick);
    Linking.openURL(this.state.recommend.link);
  };

  UNSAFE_componentWillMount() {
    const {state} = this.props.navigation;
    try {
      Data.getRecommend(
        CommonDataManager.getInstance().getSelectedLanguage().iso,
      ).then(data => {
        this.setState({
          recommend: data,
          isLoading: false,
        });
      });
    } catch (error) {
      Sentry.captureMessage(error);
      Alert.alert(strings.noConnection);
      this.props.navigation.pop();
    }

    ga = new Analytics(
      'UA-74911113-1',
      DeviceInfo.getUniqueId(),
      1,
      DeviceInfo.getUserAgent(),
    );
    let screenView = new GAHits.ScreenView(
      'Baby Exercise App',
      'Anbefalings skærm',
    );
    ga.send(screenView);
  }
  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }
  _orientationDidChange = orientation => {
    this.setState({orientation: orientation}); //Just to rerender
  };
  UNSAFE_componentWillUnmount() {
    Orientation.removeOrientationListener(this._orientationDidChange);
  }

  render() {
    if (this.state.isLoading) {
      return <ActivityIndicator />;
    }
    let linktext = 'Link';
    if (this.state.recommend.link_text) {
      linktext = this.state.recommend.link_text;
    }

    return (
      <MenuDrawer open={this.state.open} hideHeader={true}>
        <View style={styles.container}>
          <HeaderImageScrollView
            scrollIndicatorInsets={{right: 1}}
            maxHeight={isTablet ? 500 : 250}
            minHeight={Platform.OS === 'ios' ? 75 : 60}
            maxOverlayOpacity={1}
            overlayColor="rgb(129,206,219)"
            fadeOutForeground
            renderHeader={() => (
              <Image
                source={{uri: Config.URL + this.state.recommend.image}}
                style={styles.image}
              />
            )}
            renderTouchableFixedForeground={() => (
              <Header openDrawer={this.openDrawer.bind(this)} />
            )}
            renderForeground={() => <View style={styles.titleContainer} />}>
            <ScrollView scrollIndicatorInsets={{right: 1}}>
              {/* <RadialGradient
                style={styles.contentContainer}
                colors={['rgb(199,129,156)', 'rgb(129,206,219)']}
                center={[0, 0]}
                minHeight={Dimensions.get('window').height}
                radius={500}> */}
              <LinearGradient
                colors={['rgb(199,129,156)', 'rgb(129,206,219)']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={{minHeight: Dimensions.get('window').height}}>
                <TriggeringView />
                <View style={styles.innerContainer}>
                  <TouchableWithoutFeedback onPress={this.openLink}>
                    <View style={styles.linkBox}>
                      <Text style={styles.link}>{linktext}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <Text style={styles.headline}>
                    {this.state.recommend.title}
                  </Text>
                  <Text style={styles.paragraphs}>
                    {this.state.recommend.text}
                  </Text>
                </View>
              </LinearGradient>
              {/* </RadialGradient> */}
            </ScrollView>
          </HeaderImageScrollView>
        </View>
      </MenuDrawer>
    );
  }
}

export default RecommendScreen;
