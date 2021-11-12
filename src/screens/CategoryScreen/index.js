import MenuDrawer from '@components/MenuDrawer';
import React, { Component } from 'react';
import { } from 'react-native';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import VideoSide from '@components/VideoSide';
import DownloadProgressBar from '@components/DownloadProgressBar';


class CategoryScreen extends Component {


    render() {

        return (
            <MenuDrawer>
                <VideoSide productId={this.props.navigation.state.params.productId} navigation={this.props.navigation} />
                    <DownloadProgressBar />
            </MenuDrawer>
        );
    }




}
export default withNavigationFocus(CategoryScreen)
