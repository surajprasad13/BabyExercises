import styles from './styles';
import React, {Component} from 'react';
import {
  View,
  StatusBar,
  TouchableWithoutFeedback,
  Image,
  Platform,
} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import {withNavigationFocus} from 'react-navigation-is-focused-hoc';
import Config from '@config/Config';
import strings from '@config/strings';
import Toast from 'react-native-simple-toast';
import SystemSetting from 'react-native-system-setting';

class VideoPlayerScreen extends Component {
  async UNSAFE_componentWillMount() {
    let params = this.props.navigation.state.params;
    this.setState({
      videoPath: params.videoPath,
      video: params.video,
      isLoading: false,
    });
    SystemSetting.setAppStore(true);
    // Orientation.lockToLandscape();
  }
  // componentWillUnmount(){
  //     Orientation.unlockAllOrientations();
  // }

  /**
   * When video starts playing
   *
   * @memberof VideoPlayerScreen
   */
  onVideoPlay() {
    SystemSetting.getVolume().then(volume => {
      if (volume == 0) {
        Toast.show(strings.zeroVolume, Toast.LONG);
      }
    });
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
        <StatusBar hidden={true} />

        <VideoPlayer
          hideControlsOnStart={false}
          onStart={() => this.onVideoPlay()}
          thumbnail={{uri: Config.URL + this.state.video.image}}
          video={{uri: this.state.videoPath}}
          ref={r => (this.player = r)}
        />
        <TouchableWithoutFeedback onPress={() => this.handleBackButton()}>
          <View style={styles.back}>
            <Image source={icon} style={styles.backIcon} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
export default withNavigationFocus(VideoPlayerScreen);
