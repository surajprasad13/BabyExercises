import styles from './styles';
import React, {Component} from 'react';
import {
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  Share,
} from 'react-native';

import Data from '@library/data';
import Text from '@components/AppText';
import LinearGradient from 'react-native-linear-gradient';
import CommonDataManager from '@library/CommonDataManager';
import strings from '@config/strings';
import * as Sentry from '@sentry/react-native';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  UNSAFE_componentWillMount() {
    try {
      Data.getPages().then(data => {
        this.setState({
          pages: data.pages.sort(function (a, b) {
            return a.sort > b.sort ? 1 : b.sort > a.sort ? -1 : 0;
          }),
          isLoading: false,
        });
      });
    } catch (error) {
      Sentry.captureMessage(error);
    }
  }

  navigate(page, data) {
    this.props.closeDrawer();
    this.props.nav.navigate(page, data);
  }

  render() {
    if (this.state.isLoading) {
      return <ActivityIndicator />;
    }

    let homePageData = {page_id: 1, title: strings.homepage};

    return (
      <LinearGradient
        colors={['rgba(134,194,211,0.8)', 'rgba(48,86,108, 0.8)']}
        style={styles.container}>
        <ScrollView scrollIndicatorInsets={{right: 1}}>
          <View style={styles.closeButton}>
            <TouchableWithoutFeedback onPress={this.props.closeDrawer}>
              <Image
                style={styles.closeImage}
                source={require('./../../../assets/cancel/cancel_icon.png')}
              />
            </TouchableWithoutFeedback>
          </View>
          <Text style={styles.menuHeader}></Text>

          {this.renderMenuItem('Home', homePageData)}

          {this.state.pages.map(pageData => {
            if (
              pageData.lang_iso ===
              CommonDataManager.getInstance().getSelectedLanguage().iso
            ) {
              if (pageData.image != null) {
                return this.renderMenuItem('TextAndImage', pageData);
              }
              return this.renderMenuItem('Text', pageData);
            }
          })}

          <View style={styles.menuItem}>
            <TouchableOpacity onPress={() => this.share()}>
              <Text style={styles.menuItemText}>{strings.share}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.border}></View>
          <Image
            source={require('./../../../assets/baby.png')}
            style={styles.baby}
          />
        </ScrollView>
      </LinearGradient>
    );
  }

  renderMenuItem(page, pageData) {
    return (
      <View style={styles.menuItem} key={pageData.page_id}>
        <TouchableOpacity onPress={() => this.navigate(page, pageData)}>
          <Text style={styles.menuItemText}>{pageData.title}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  share() {
    let url = 'https://babyexercisesapp.com/?lang=';
    let iso = CommonDataManager.getInstance().getSelectedLanguage().iso;

    switch (iso) {
      case 'da': {
        url = url.concat('da/');
        break;
      }
      case 'de': {
        url = url.concat('de/');
        break;
      }
      case 'es': {
        url = url.concat('es/');
        break;
      }
      case 'sv': {
        url = url.concat('sv/');
        break;
      }
      default: {
        url = url.concat('en/');
        break;
      }
    }

    Share.share({
      title: strings.appTitle,
      message: url,
      url: url,
      dialogTitle: strings.share,
    })
      .then(result => console.log(result))
      .catch(errorMsg => console.log(errorMsg));
  }
}

export default Menu;
