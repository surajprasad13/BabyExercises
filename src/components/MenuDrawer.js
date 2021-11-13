import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {withNavigation} from 'react-navigation';
import Drawer from 'react-native-drawer';
import Menu from './Menu';
import Header from './Header';
//import RadialGradient from 'react-native-radial-gradient';
import {isTablet} from 'react-native-device-detection';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: 50,
    padding: 0,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: 32,
    height: 32,
    alignSelf: 'flex-end',
  },
  title: {
    textAlign: 'center',
  },
});

const drawerStyles = {
  drawer: {shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
};

class MenuDrawer extends Component {
  constructor(props) {
    super(props);
    this.listenerId = null;
  }

  componentDidUpdate() {
    if (this.props.open == true) {
      this.open();
    }
  }
  /**
   * Close the drawer
   *
   * @memberof MenuDrawer
   */
  close = () => {
    this._drawer.close();
  };
  /**
   * Open the drawer
   *
   * @memberof MenuDrawer
   */
  open = () => {
    this._drawer.open();
  };

  render() {
    return (
      <Drawer
        ref={ref => (this._drawer = ref)}
        captureGestures={true}
        type="overlay"
        side="right"
        content={
          <Menu
            nav={this.props.navigation}
            closeDrawer={this.close.bind(this)}
          />
        }
        tapToClose={true}
        closedDrawerOffset={-3}
        panOpenMask={0.03}
        openDrawerOffset={isTablet ? 0.6 : 0.2}
        styles={drawerStyles}
        tweenHandler={ratio => ({
          main: {opacity: (2 - ratio) / 2},
        })}>
        {/* <RadialGradient style={{ flex: 1 }}
                    colors={['rgb(199,129,156)', 'rgb(129,206,219)']}
                    center={[0, 0]}
                    radius={500}> */}

        <LinearGradient
          colors={['rgb(199,129,156)', 'rgb(129,206,219)']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={{flex: 1}}>
          {this.props.hideHeader != true && (
            <Header openDrawer={this.open.bind(this)} />
          )}

          {this.props.children}
        </LinearGradient>

        {/* </RadialGradient> */}
      </Drawer>
    );
  }
}

export default withNavigation(MenuDrawer);
