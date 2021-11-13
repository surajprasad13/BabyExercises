import styles from './styles';
import React, {Component} from 'react';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from 'react-native';
import {withNavigation} from 'react-navigation';
import LanguageSelector from '../LanguageSelector';
import strings from '@config/strings';

import Text from '@components/AppText';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  refresh() {
    if (this.props.renderParent !== undefined) {
      this.props.renderParent();
    }

    const name = this.props.navigation.state.routeName;
    const params = this.props.navigation.state.params;
    this.props.navigation.pop();
    this.props.navigation.navigate(name, params);
  }

  handleMenuButton() {
    this.props.openDrawer();
  }

  handleBackButton() {
    this.props.navigation.goBack();
  }

  render() {
    let icon =
      Platform.OS === 'ios'
        ? require('./../../../assets/back/ios/back.png')
        : require('./../../../assets/back/android/back.png');

    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.backButton}>
            {this.props.navigation.state.routeName != 'Home' && (
              <TouchableWithoutFeedback onPress={() => this.handleBackButton()}>
                <View style={styles.row}>
                  <Image source={icon} style={styles.backIcon} />

                  {Platform.OS === 'ios' && (
                    <View style={styles.backText}>
                      <Text
                        style={{
                          fontFamily: 'Soho Gothic Pro',
                          color: 'white',
                        }}>
                        {strings.back}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
          <View style={styles.language}>
            <LanguageSelector renderParent={this.refresh.bind(this)} />
          </View>
          <View style={styles.menuButton}>
            <TouchableWithoutFeedback onPress={() => this.handleMenuButton()}>
              <View style={styles.menuButtonTouch}>
                <Image
                  source={require('./../../../assets/menu/menu.png')}
                  style={styles.icon}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }
}

export default withNavigation(Header);
