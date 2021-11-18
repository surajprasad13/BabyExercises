import styles from './styles';
import React, {Component} from 'react';
import {
  View,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Text from '@components/AppText';
import CommonDataManager from '@library/CommonDataManager';
import MenuDrawer from '@components/MenuDrawer';
import {withNavigationFocus} from 'react-navigation-is-focused-hoc';
import strings from '@config/strings';
import Data from '@library/data';
import Config from '@config/Config';
import RNFetchBlob from 'rn-fetch-blob';
import * as Sentry from '@sentry/react-native';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import VideoSide from '@components/VideoSide';
import DownloadProgressBar from '@components/DownloadProgressBar';
import {isTablet} from 'react-native-device-detection';
import Video from 'react-native-video';
import SystemSetting from 'react-native-system-setting';

import Toast from 'react-native-simple-toast';

const actionSheetStyles = {
  buttonText: {
    fontFamily: 'Soho Gothic Pro',
    fontSize: 16,
    textAlign: 'center',
  },
  titleText: {
    fontFamily: 'Soho Gothic Pro',
  },
};

class VideoScreen extends Component {
  state = {downloadProgress: 0, isLoading: true, video: null, rate: 0};

  async UNSAFE_componentWillMount() {
    let s = this.props.navigation.state.params.item;
    let iso = CommonDataManager.getInstance().getSelectedLanguage().iso;
    let videoData = await Data.getVideoData(iso, s.video_id); //for reload (language change)

    let file = await AsyncStorage.getItem('video' + videoData.id);
    let isDownloaded = false;
    if (file != null) {
      isDownloaded = true;
    }
    this.setState({
      video: videoData,
      isDownloaded: isDownloaded,
      isLoading: false,
      file: file,
    });
  }
  /**
   * Do download
   *
   * @memberof VideoScreen
   */
  async videoClick() {
    if (this.state.isDownloaded) {
      if (Platform.OS == 'ios') {
        this.iosPlay();
      } else {
        //Go to video player screen if Android
        this.props.navigation.navigate('VideoPlayer', {
          videoPath: this.state.file,
          video: this.state.video,
        });
      }
    } else {
      this.showActionSheet();
    }
  }

  async iosPlay() {
    this.player.seek(0);
    this.player.presentFullscreenPlayer();

    let firstPlay = await AsyncStorage.getItem('firstPlay');
    if (JSON.parse(!firstPlay)) {
      AsyncStorage.setItem('firstPlay', JSON.stringify(false));
      Toast.show(strings.firstPlay, Toast.LONG);
    } else {
      SystemSetting.getVolume().then(volume => {
        if (volume == 0) {
          Toast.show(strings.zeroVolume, Toast.LONG);
        }
      });
    }
  }

  /**
   * Download array of videos
   *
   * @param {any} ids
   * @returns
   * @memberof VideoScreen
   */
  async download(ids) {
    let id = ids[0];
    CommonDataManager.getInstance().setIsDownloading(true);
    //If file already exists, skip.
    let file = await AsyncStorage.getItem('video' + id);
    if (file != null) {
      ids.shift(); // Donext
      if (ids.length > 0) {
        CommonDataManager.getInstance().addToCurrentDownload();
        this.download(ids);
        return;
      }
    }
    global.events.trigger('download.next', {
      num: CommonDataManager.getInstance().getCurrentDownload(),
    });
    let options = {
      fileCache: true,
      appendExt: Platform.OS == 'ios' ? 'm4v' : '',
    };
    let token = await AsyncStorage.getItem('token');

    RNFetchBlob.config(options)
      .fetch('GET', Config.API_URL + '/video/' + id, {
        Authorization: 'Bearer ' + token,
      })
      .progress((received, total) => {
        global.events.trigger('download.progress', {
          percent: received / total,
          total: this.state.totalVideos,
        });
      })
      .then(res => {
        AsyncStorage.setItem('video' + id, res.path()); //Save path to video

        if (this.state.video.id == id) {
          //This video just got downloaded, update its state
          this.setState({isDownloaded: true, file: res.path()});
        }

        ids.shift(); //Next if more
        if (ids.length > 0) {
          CommonDataManager.getInstance().addToCurrentDownload();
          this.download(ids);
        } else {
          CommonDataManager.getInstance().setIsDownloading(false);
          CommonDataManager.getInstance().setCurrentDownload(1);
        }
        global.events.trigger('download.progress', {
          percent: 0,
          total: this.state.totalVideos,
        }); //Updates progress bar
        global.events.trigger('download.finish', id); // Updates category screen
      })
      .catch((errorMessage, statusCode) => {
        Sentry.captureMessage(errorMessage);
      });
  }

  /**
   * Download all or all in category
   *
   * @param {boolean} [downloadAll=false]
   * @memberof VideoScreen
   */
  async downloadMultiple(downloadAll = false) {
    let iso = CommonDataManager.getInstance().getSelectedLanguage().iso;
    let thisCategory = this.state.video.product_id;
    let videoArr = [];
    let allAsString = await AsyncStorage.getItem('Purchases');
    let allBought = JSON.parse(allAsString);
    if (downloadAll) {
      let freeVideos = await Data.getFreeVideos(iso);
      if (allBought != null) {
        //If you have bought something

        if (allBought.includes('videopackage_all')) {
          //If bought "All Videos category"
          let cats = await Data.getCategories(iso); //Get all individual package names
          allBought = cats.categories.map(c => c.product_id);
        }

        for (let productId of allBought) {
          let videos = await Data.getVideos(iso, productId);
          videoArr.push(...Array.from(videos)); //Add purchased category videos to download list.
        }
        for (let freeVid of freeVideos) {
          //Add free video from category you don't own
          if (!allBought.includes(freeVid.product_id)) {
            videoArr.push(freeVid);
          }
        }
      } else {
        //if doesn't own anything - download all free videos
        videoArr.push(...Array.from(freeVideos));
      }
    }
    //ALL IN CATEGORY
    else {
      let allInCategory = await Data.getVideos(iso, thisCategory);
      if (allBought != null && allBought.includes(thisCategory)) {
        //if bought add all to dl list
        videoArr.push(...Array.from(allInCategory));
      } else {
        //if not bought, add free to dl list
        let freeInThisCategory = allInCategory.filter(function (vid) {
          return vid.isFree;
        });
        videoArr.push(...Array.from(freeInThisCategory));
      }
    }

    let videoCount = videoArr.length;
    let idsArray = videoArr.map(a => a.id);
    this.setState({totalVideos: videoCount});
    CommonDataManager.getInstance().setCurrentDownload(1);
    this.download(idsArray);
  }
  showActionSheet = () => {
    this.ActionSheet.show();
  };

  render() {
    if (this.state.isLoading) {
      return <ActivityIndicator />;
    }
    return (
      <MenuDrawer>
        <View style={styles.wrapper}>
          {this.state.file != null && Platform.OS == 'ios' && (
            <Video
              source={{uri: this.state.file}}
              ref={ref => {
                this.player = ref;
              }}
              rate={this.state.rate}
              onFullscreenPlayerWillPresent={() => this.setState({rate: 1})}
              onFullscreenPlayerDidDismiss={() => this.setState({rate: 0})}
              poster={Config.URL + this.state.video.image}
              resizeMode="contain"
            />
          )}

          <ScrollView scrollIndicatorInsets={{right: 1}}>
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.border}
                onPress={() => this.videoClick(this.state.video.id)}>
                <ImageBackground
                  resizeMode="cover"
                  style={styles.thumbnail}
                  source={{uri: Config.URL + this.state.video.image}}>
                  <Image
                    style={styles.centerImage}
                    source={this.renderImageIcon()}
                  />
                </ImageBackground>
              </TouchableOpacity>
              <View style={styles.textWrap}>
                <Text style={styles.title}>{this.state.video.title}</Text>
                <Text style={styles.text}>{this.state.video.description}</Text>
                <Text style={styles.lengthLabel}>
                  {strings.videoLength}: {this.state.video.duration}
                </Text>
              </View>
            </View>
          </ScrollView>

          {isTablet && (
            <View style={styles.sideView}>
              <VideoSide
                productId={this.state.video.product_id}
                navigation={this.props.navigation}
                exclude={this.state.video.id}
              />
            </View>
          )}
        </View>

        <DownloadProgressBar />

        <ActionSheet
          styles={actionSheetStyles}
          ref={o => (this.ActionSheet = o)}
          title={strings.download}
          tintColor="#23475f"
          options={[
            strings.downloadOnlyThis,
            strings.downloadAllInCategory,
            strings.downloadAllVideos,
            strings.cancel,
          ]}
          destructiveButtonIndex={3}
          onPress={index => {
            if (CommonDataManager.getInstance().getIsDownloading()) {
              return;
            }

            switch (index) {
              case 0:
                this.setState({totalVideos: 1});
                global.events.trigger('download.progress', {totalVideos: 1});
                this.download([this.state.video.id]);
                break;
              case 1:
                this.downloadMultiple();
                break;
              case 2:
                this.downloadMultiple(true);
                break;
            }
          }}
        />
      </MenuDrawer>
    );
  }

  renderImageIcon() {
    let source = require('./../../../assets/dl/dl_icon.png');
    if (this.state.isDownloaded) {
      //is downloaded
      source = require('./../../../assets/play/playicon.png');
    }
    return source;
  }
}

export default withNavigationFocus(VideoScreen);
