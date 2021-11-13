import styles from './styles';
import tabletPotraitStyles from './tabletPotraitStyles';
import React, {Component} from 'react';
import Text from '@components/AppText';
import {
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {withNavigationFocus} from 'react-navigation-is-focused-hoc';
import MenuDrawer from '@components/MenuDrawer';
import Data from '@library/data';
import Loading from '@components/Loading';
import strings from '@config/strings';
import CommonDataManager from '@library/CommonDataManager';
import Config from '@config/Config';
import Rating from '@library/Rating';
import * as Sentry from '@sentry/react-native';
import {isTablet} from 'react-native-device-detection';
import Orientation from 'react-native-orientation-locker';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      lang: '',
    };
  }

  getStyle() {
    if (this.state.orientation == 'PORTRAIT' && isTablet) {
      return tabletPotraitStyles;
    }
    return styles;
  }

  async componentWillMount() {
    Rating(); //Does not show everytime (build in counter)
    this.getData();

    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }
  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }
  _orientationDidChange = orientation => {
    this.setState({orientation: orientation});
  };
  componentWillUnmount() {
    Orientation.removeOrientationListener(this._orientationDidChange);
  }
  /**
   * Gets categories
   *
   * @memberof HomeScreen
   */
  async getData() {
    strings.setLanguage(
      CommonDataManager.getInstance().getSelectedLanguage().iso,
    );
    console.log('TEST');
    try {
      Data.getCategories(
        CommonDataManager.getInstance().getSelectedLanguage().iso,
      ).then(data => {
        this.setState({
          categories: data.categories,
          isLoading: false,
          lang: CommonDataManager.getInstance().getSelectedLanguage().iso,
        });
      });
    } catch (error) {
      Alert.alert(strings.error, strings.errorMsg);
      Sentry.captureMessage(error);
    }
  }

  render() {
    if (this.state.isLoading) {
      return <Loading />;
    }
    if (
      this.state.lang !=
      CommonDataManager.getInstance().getSelectedLanguage().iso
    ) {
      this.getData();
    }

    return (
      <MenuDrawer>
        <View style={this.getStyle().outerContainer}>
          <ScrollView
            style={this.getStyle().container}
            scrollIndicatorInsets={{right: 1}}>
            <Text style={this.getStyle().headline}>{strings.appTitle}</Text>
            <View style={this.getStyle().categories}>
              {this.state.categories.map(category => {
                return this.renderCategoryItem(category);
              })}
            </View>

            <View style={this.getStyle().rattleContainer}>
              <TouchableOpacity
                style={this.getStyle().rattleInnerContainer}
                onPress={() =>
                  this.props.navigation.navigate('Recommend', {
                    title: 'Månedens gave',
                  })
                }>
                <Image
                  style={this.getStyle().image}
                  source={require('./../../../assets/rattle/rattle-v2-LK.png')}
                />
                <Text style={this.getStyle().rattleText}>
                  {strings.recommend}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={this.getStyle().links}>
              <TouchableOpacity
                style={this.getStyle().linkLeft}
                onPress={() => {
                  const FANPAGE_ID = '1516062701973000';
                  const FANPAGE_URL_FOR_APP =
                    Platform.OS == 'ios'
                      ? `fb://page?id=${FANPAGE_ID}`
                      : `fb://page/${FANPAGE_ID}`;
                  const FANPAGE_URL_FOR_BROWSER = `https://fb.com/${FANPAGE_ID}`;
                  Linking.canOpenURL(FANPAGE_URL_FOR_APP).then(supported => {
                    if (!supported) {
                      Linking.openURL(FANPAGE_URL_FOR_BROWSER);
                    } else {
                      Linking.openURL(FANPAGE_URL_FOR_APP);
                    }
                  });
                }}>
                <Image
                  style={this.getStyle().linkImage}
                  source={require('./../../../assets/social/facebook_icon.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  const instagram_username = 'babyexercisesapp';
                  const browserUrl =
                    'http://instagram.com/_u/' + instagram_username;
                  const appUrl =
                    'instagram://user?username=' + instagram_username;

                  Linking.canOpenURL(appUrl).then(supported => {
                    if (!supported) {
                      Linking.openURL(browserUrl);
                    } else {
                      Linking.openURL(appUrl);
                    }
                  });
                }}>
                <Image
                  style={this.getStyle().linkImage}
                  source={require('./../../../assets/social/Instagram_icon.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={this.getStyle().linkRight}
                onPress={() => {
                  Linking.openURL('https://weibo.com/u/3095646197');
                }}>
                <Image
                  style={this.getStyle().linkImage}
                  source={require('./../../../assets/social/weibo_icon.png')}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
          {isTablet && this.state.orientation == 'LANDSCAPE' && (
            <View style={this.getStyle().imageContainer}>
              <Image
                style={this.getStyle().tabletImage}
                source={require('./../../../assets/big_baby/Baby_icon_hero-LK.png')}
              />
            </View>
          )}
        </View>
      </MenuDrawer>
    );
  }

  /**
   * Render method for categories
   *
   * @param {any} category
   * @returns
   * @memberof HomeScreen
   */
  renderCategoryItem(category) {
    return (
      <TouchableWithoutFeedback
        key={category.id}
        onPress={() =>
          this.props.navigation.navigate('Category', {
            productId: category.product_id,
          })
        }>
        <View style={this.getStyle().categoryItem}>
          <Image
            style={this.getStyle().categoryImage}
            source={{uri: Config.URL + category.image}}
          />
          <View style={this.getStyle().textWrap}>
            <Text style={this.getStyle().categoryText}>{category.title}</Text>
            <Text style={this.getStyle().months}>{category.subtitle}</Text>
          </View>
          <View style={this.getStyle().videos}>
            <Text style={this.getStyle().video}>{category.VideoCount}</Text>
            <Text style={this.getStyle().video}>
              {strings.videos.toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default withNavigationFocus(HomeScreen, true);
