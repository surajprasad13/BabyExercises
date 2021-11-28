import styles from './styles';
import React, {Component} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';

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
import Config from '@config/Config';
import renderIf from '@tools/renderIf';
import * as Sentry from '@sentry/react-native';
import {isTablet} from 'react-native-device-detection';
import Hyperlink from 'react-native-hyperlink';
import Orientation from 'react-native-orientation-locker';

import LinearGradient from 'react-native-linear-gradient';

class TextAndImageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {open: false, isLoading: true};
  }

  openDrawer = () => {
    this.setState({open: true});
  };

  UNSAFE_componentWillMount() {
    const {state} = this.props.navigation;
    try {
      Data.getPage(
        CommonDataManager.getInstance().getSelectedLanguage().iso,
        state.params.page_id,
      ).then(data => {
        this.setState({
          page: data.pages,
          isLoading: false,
        });
      });
    } catch (error) {
      Sentry.captureMessage(error);
    }
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
    const {params} = this.props.navigation.state;

    if (this.state.isLoading) {
      return <ActivityIndicator />;
    }
    return (
      <MenuDrawer open={this.state.open} hideHeader={true}>
        <View style={styles.container}>
          <HeaderImageScrollView
            scrollIndicatorInsets={{right: 1}}
            maxHeight={isTablet ? 500 : 250}
            minHeight={Platform.OS === 'ios' ? 100 : 80}
            maxOverlayOpacity={1}
            overlayColor="rgb(129,206,219)"
            fadeOutForeground
            renderHeader={() => (
              <Image
                source={{uri: Config.URL + this.state.page.image}}
                style={styles.image}
              />
            )}
            renderTouchableFixedForeground={() => (
              <Header openDrawer={this.openDrawer.bind(this)} />
            )}
            renderForeground={() => (
              <View style={styles.titleContainer}>
                {/* <Text style={styles.imageTitle}>    {this.state.page.title}</Text> */}
              </View>
            )}>
            <LinearGradient
              colors={['rgb(199,129,156)', 'rgb(129,206,219)']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              minHeight={Dimensions.get('window').height}
              style={styles.contentContainer}>
              <TriggeringView
              // onHide={() => this.navTitleView.fadeInUp(200)}
              // onDisplay={() => this.navTitleView.fadeOut(100)}
              />
              <View style={styles.innerContainer}>
                <Text style={styles.headline}>{this.state.page.headline}</Text>
                {renderIf(
                  this.state.page.support,
                  <Hyperlink linkDefault={true}>
                    <Text style={styles.paragraphs}>
                      {this.state.page.text}
                    </Text>
                  </Hyperlink>,
                )}
                {renderIf(
                  !this.state.page.support,
                  <Text style={styles.paragraphs}>{this.state.page.text}</Text>,
                )}

                {renderIf(
                  this.state.page.support,
                  <View style={styles.deviceInfo}>
                    <Text style={{color: 'white'}}>
                      App v. {DeviceInfo.getReadableVersion()}
                    </Text>
                    <Text style={{color: 'white'}}>
                      OS: {DeviceInfo.getSystemName()}{' '}
                      {DeviceInfo.getSystemVersion()}{' '}
                    </Text>
                    <Text style={{color: 'white'}}>
                      UID: {DeviceInfo.getUniqueId()}{' '}
                    </Text>
                  </View>,
                )}
              </View>
            </LinearGradient>
          </HeaderImageScrollView>
        </View>
      </MenuDrawer>
    );
  }
}

export default TextAndImageScreen;
