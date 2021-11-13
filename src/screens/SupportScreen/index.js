import React from 'react';

import DeviceInfo from 'react-native-device-info';
import MenuDrawer from '@components/MenuDrawer';
import Text from '@components/AppText';
import {withNavigationFocus} from 'react-navigation-is-focused-hoc';

class TextScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MenuDrawer>
        <Text>App v. {DeviceInfo.getReadableVersion()}</Text>
        <Text>
          OS: {DeviceInfo.getSystemName()} {DeviceInfo.getSystemVersion()}{' '}
        </Text>
        <Text>UID: {DeviceInfo.getUniqueId()} </Text>
        <Text>DID: {DeviceInfo.getDeviceId()}</Text>
      </MenuDrawer>
    );
  }
}

export default TextScreen;
