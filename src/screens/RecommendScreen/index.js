import React, { Component } from 'react';
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
import * as Animatable from 'react-native-animatable';

import { isTablet } from 'react-native-device-detection';
import strings from '@config/strings';
import { withNavigation } from 'react-navigation';

import RadialGradient from 'react-native-radial-gradient';
import MenuDrawer from '@components/MenuDrawer';
import Header from '@components/Header';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc'
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import Text from '@components/AppText';
import Data from '@library/data';
import DeviceInfo from 'react-native-device-info';
import CommonDataManager from '@library/CommonDataManager';
import Orientation from 'react-native-orientation';

import Config from '@config/Config';
import {
  Analytics,
  Hits as GAHits,
  Experiment as GAExperiment
} from 'react-native-google-analytics';
import * as Sentry from '@sentry/react-native';
let ga = this.ga = null;

class RecommendScreen extends Component {

  constructor(props) {
    super(props);
    this.state = { open: false, isLoading: true }
  }
  /**
   * Opens the navigation drawer
   * @memberof RecommendScreen
   */
  openDrawer = () => {
    this.setState({ open: true });

  }
  /**
   * Opens the link from the recommendation
   * @memberof RecommendScreen
   */
  openLink = () => {
    let linkClick = new GAHits.ScreenView(
      'Baby Exercise App',
      'Anbefalings link klik'
    );
    ga.send(linkClick);
    Linking.openURL(this.state.recommend.link);
  }

  componentWillMount() {
   
    const { state } = this.props.navigation;
    try {
      Data.getRecommend(CommonDataManager.getInstance().getSelectedLanguage().iso).then(data => {
        this.setState({
          recommend: data,
          isLoading: false,
        });
      });
    }
    catch (error) { 
      Sentry.captureMessage(error);
      Alert.alert(strings.noConnection)
      this.props.navigation.pop();
     }

    ga = new Analytics('UA-74911113-1', DeviceInfo.getUniqueId(), 1, DeviceInfo.getUserAgent());
    let screenView = new GAHits.ScreenView(
      'Baby Exercise App',
      'Anbefalings skærm'
    );
    ga.send(screenView);

  }
  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }
  _orientationDidChange = (orientation) => {
    this.setState({ orientation: orientation }); //Just to rerender
  }
  componentWillUnmount() {
    Orientation.removeOrientationListener(this._orientationDidChange);
  }

  render() {
    const { params } = this.props.navigation.state;

    if (this.state.isLoading) {
      return (
        <ActivityIndicator />
      )
    }
    let linktext = "Link";
    if(this.state.recommend.link_text) {
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
            renderHeader={() => <Image source={{ uri: Config.URL + this.state.recommend.image }} style={styles.image} />}
            renderTouchableFixedForeground={() => (
              <Header openDrawer={this.openDrawer.bind(this)} />
            )}
            renderForeground={() => (
              <View style={styles.titleContainer}>
               
              </View>
            )}
          >
            <ScrollView 
            scrollIndicatorInsets={{right: 1}}>
              <RadialGradient style={styles.contentContainer}
                colors={['rgb(199,129,156)', 'rgb(129,206,219)']}
                center={[0, 0]}
                minHeight={Dimensions.get('window').height}
                radius={500}>
                <TriggeringView>
                </TriggeringView>
                <View style={styles.innerContainer}>
                  <TouchableWithoutFeedback onPress={this.openLink}>
                    <View style={styles.linkBox}>
                      <Text style={styles.link}>{linktext}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <Text style={styles.headline}>{this.state.recommend.title}</Text>
                  <Text style={styles.paragraphs}>{this.state.recommend.text}</Text>

                </View>

              </RadialGradient>
            </ScrollView>
          </HeaderImageScrollView>
        </View>

      </MenuDrawer>

    );
  }
}




export default withNavigationFocus(RecommendScreen)
