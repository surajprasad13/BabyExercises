import Text from '@components/AppText';
import MenuDrawer from '@components/MenuDrawer';
import CommonDataManager from '@library/CommonDataManager';
import Data from '@library/data';
import React, { Component } from 'react';
import { ActivityIndicator, Image, ImageBackground, TouchableWithoutFeedback, View, AsyncStorage, ScrollView } from 'react-native';
import styles from './styles';
import PayModal from '@components/PayModal';
import Config from '@config/Config';
import Orientation from 'react-native-orientation-locker';
import Toast from 'react-native-simple-toast';

export default class VideoSide extends Component {

    constructor(props) {
        super(props);
        this.state = { isLoading: true, isBought: false }
        this.downloadFinishListenerId = null;
    }

    componentDidMount() {
        Orientation.addOrientationListener(this._orientationDidChange);
    }

    _orientationDidChange = (orientation) => {
        if (this.state.orientation != orientation) {
            this.setState({ showModal: false, orientation: orientation })

        }
    }

    componentWillUnmount() {
        // Remember to remove listener
        Orientation.removeOrientationListener(this._orientationDidChange);
        global.events.removeListener("download.finish", this.downloadFinishListenerId);
    }

    /**
     * Gets videos from API
     * Gets is if bought from AsyncStorage
     * 
     * @memberof CategoryScreen
     */
    async componentWillMount() {

        this.setState({ orientation: Orientation.getInitialOrientation() })
        await this.getData();
        this.downloadFinishListenerId = global.events.addListener("download.finish", (id) => {

            let all = this.state.videos;
            let vb = all.findIndex(o => o.id == id);
            all[vb].isDownloaded = true;

            this.setState({
                videos: all,
            });
        });
    }

    /**
     * Gets and sets the data
     * 
     * @memberof VideoSide
     */
    async getData() {
        const productId = this.props.productId;
        let lang = CommonDataManager.getInstance().getSelectedLanguage();
        this.setState({ lang: lang.iso })
        let videos = await Data.getVideos(lang.iso, productId);
        for (let vid of videos) {
            let exist = await AsyncStorage.getItem("video" + vid.id);
            vid.isDownloaded = exist != null;
        }
        let boughtAsString = await AsyncStorage.getItem('Purchases');
        let isBought = false;
        if (boughtAsString != null) {
            let bought = JSON.parse(boughtAsString);
            if (bought.includes(productId) || bought.includes(Config.AllVideoID)) {
                isBought = true;
            }

        }
        this.setState({
            videos: videos.sort(function (a, b) { return (a.sort > b.sort) ? 1 : ((b.sort > a.sort) ? -1 : 0); }),
            isLoading: false,
            isBought: isBought
        });
    }

    /**
   * Stops the modal from showing when screen gets background rendered
   * 
   * @param {any} newProps 
   * @memberof VideoSide
   */
    componentWillReceiveProps(newProps) {
        this.setState({ showModal: false });
    }
    /**
     * Handles when a video item is touched
     * Open PayModal, if not own and not free
     * 
     * @param {any} item 
     * @memberof CategoryScreen
     */
    onVideoPress(item) {
        if (item.isFree || this.state.isBought) {
            this.props.navigation.navigate("Video", { item: item })
        }
        else {
            this.setState({ showModal: true });
        }
    }

    render() {
        if (this.state.lang != CommonDataManager.getInstance().getSelectedLanguage().iso) {
            this.getData();
        }

        if (this.state.isLoading) {
            return (
                <ActivityIndicator />
            )
        }
        let index = 0;
        return (
            <ScrollView
            scrollIndicatorInsets={{right: 1}}>
                <PayModal shouldOpen={this.state.showModal} navigation={this.props.navigation} />
                <View style={styles.container}>
                    {this.state.videos.map(category => {
                        index++;
                        return this.renderItem(category, index);
                    })}
                </View>
            </ScrollView>

        );
    }
    renderItem(item, index) {

        let list = CommonDataManager.getInstance().getAllJustDownloaded();
        if (list.includes(item.id)) {
            item.isDownloaded = true;
        }

        let dims = this.ribbonSize(146, 85);
        const banners = {
            da: require('./../../../assets/banner-da/Ribbonfree.png'),
            en: require('./../../../assets/banner-en/Ribbonfree.png'),
            es: require('./../../../assets/banner-da/Ribbonfree.png'),
            de: require('./../../../assets/banner-da/Ribbonfree.png'),
            sv: require('./../../../assets/banner-da/Ribbonfree.png')
        }
        let banner = banners[CommonDataManager.getInstance().getSelectedLanguage().iso];
        if (this.props.exclude != item.id) { //Hide video from sidepanel 
            return (
                <TouchableWithoutFeedback key={item.id} onPress={() => this.onVideoPress(item)}>
                    <View style={styles.item}>
                        <View style={styles.imageBorder}>
                            <ImageBackground resizeMode="cover" style={styles.image} source={{ uri: Config.URL + item.image }}>
                                <Image style={styles.centerImage} source={this.renderImageIcon(item)} />
                                <Text style={styles.duration}>{item.duration}</Text>
                            </ImageBackground>
                        </View>
                        {item.isFree == 1 && <Image style={[styles.ribbon, { width: dims.width, height: dims.height }]} source={banner} />}
                        <Text style={styles.text}>{index}. {item.title}</Text>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
    }

    /**
     * Calculate ribbon (free banner) size
     * 
     * @param {any} width 
     * @param {any} height 
     * @returns 
     * @memberof VideoSide
     */
    ribbonSize(width, height) {
        var maxWidth = 220;
        var maxHeight = 40;

        if (width >= height) {
            var ratio = maxWidth / width;
            var h = Math.ceil(ratio * height);

            if (h > maxHeight) {
                // Too tall, resize
                var ratio = maxHeight / height;
                var w = Math.ceil(ratio * width);
                var ret = {
                    'width': w,
                    'height': maxHeight
                };
            } else {
                var ret = {
                    'width': maxWidth,
                    'height': h
                };
            }

        } else {
            var ratio = maxHeight / height;
            var w = Math.ceil(ratio * width);

            if (w > maxWidth) {
                var ratio = maxWidth / width;
                var h = Math.ceil(ratio * height);
                var ret = {
                    'width': maxWidth,
                    'height': h
                };
            } else {
                var ret = {
                    'width': w,
                    'height': maxHeight
                };
            }
        }

        return ret;
    }

    renderImageIcon(item) {
        let source = require('./../../../assets/lock/lock_icon.png');
        if (this.state.isBought || item.isFree) {
            if (item.isDownloaded) //if is downloaded
            {
                source = require('./../../../assets/play/playicon.png');
            }
            else {
                //Download icon
                source = require('./../../../assets/dl/dl_icon.png');
            }
        }
        return source;
    }
}

