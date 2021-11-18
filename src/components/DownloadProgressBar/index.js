import styles from './styles';
import * as Progress from 'react-native-progress';
import strings from '@config/strings';
import Text from '@components/AppText';
import CommonDataManager from '@library/CommonDataManager';

import React, {Component} from 'react';
import {View} from 'react-native';

export default class DownloadProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVideoDl: 0,
      totalVideos: props.totalVideos,
      downloadProgress: 0,
    };
    this.downloadProgressListenerId = null;
    this.startingNextDownloadListenerId = null;
  }

  UNSAFE_componentWillMount() {
    this.downloadProgressListenerId = global.events.addListener(
      'download.progress',
      progress => {
        this.setState({
          totalVideos: progress.total,
          downloadProgress: progress.percent,
        });
      },
    );
    this.startingNextDownloadListenerId = global.events.addListener(
      'download.next',
      () => {
        this.setState({currentVideoDl: this.state.currentVideoDl + 1});
      },
    );
  }

  componentWillUnmount() {
    global.events.removeListener(
      'download.progress',
      this.downloadProgressListenerId,
    );
    global.events.removeListener(
      'download.next',
      this.startingNextDownloadListenerId,
    );
  }

  render() {
    return (
      <View style={styles.progress}>
        {this.state.downloadProgress > 0 && (
          <View>
            <Text style={{fontFamily: 'Soho Gothic Pro', color: 'white'}}>
              {strings.downloadStatus}{' '}
              {CommonDataManager.getInstance().getCurrentDownload()}{' '}
              {strings.downloadStatus2} {this.state.totalVideos}
            </Text>
            <Progress.Bar
              color="rgb(250,80,121)"
              width={null}
              borderRadius={0}
              height={10}
              progress={this.state.downloadProgress}
            />
          </View>
        )}
      </View>
    );
  }
}
