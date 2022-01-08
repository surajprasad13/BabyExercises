import styles from './styles';
import React, {Component} from 'react';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import Text from '@components/AppText';
import * as RNIap from 'react-native-iap';
import Data from '@library/data';
import {withNavigationFocus} from 'react-navigation-is-focused-hoc';
import CommonDataManager from '@library/CommonDataManager';
import OneSignal from 'react-native-onesignal';
import Config from '@config/Config';
import * as Sentry from '@sentry/react-native';
import strings from '@config/strings';
import Toast from 'react-native-simple-toast';
import DeviceInfo from 'react-native-device-info';

class PayModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skus: [],
      own: [''],
      categxs: [''],
    };

    Sentry.setTag('UID', DeviceInfo.getUniqueId());
  }

  /**
   * Prepares and get products from IAP and API
   *
   * @memberof PayModal
   */

  async componentDidMount() {
    await RNIap.initConnection();
  }

  async UNSAFE_componentWillMount() {
    //Gets products from API
    let cats = await Data.getCategories(
      CommonDataManager.getInstance().getSelectedLanguage().iso,
    );
    let ids = cats.categories.map(a => a.product_id);
    this.setState({categories: cats.categories});
    Sentry.set;
    try {
      ids.push(Config.AllVideoID);
      const products = await RNIap.getProducts(ids);
      this.setState({skus: Array.from(products)});
    } catch (err) {
      Sentry.captureMessage(err);
    }
    //Gets already bought products form storage
    let allAsString = await AsyncStorage.getItem('Purchases');
    if (allAsString != null) {
      let all = JSON.parse(allAsString);
      this.setState({own: all, isLoading: false});
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({isVisible: newProps.shouldOpen});
  }
  /**
   * Toggles the visibility of the modal
   *
   * @memberof PayModal
   */
  toggleModal = () => {
    this.setState({isVisible: !this.state.isVisible});
  };
  /**
   * Renders the modal
   *
   * @returns
   * @memberof PayModal
   */
  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.toggleModal}>
          <View>{this.props.children}</View>
        </TouchableWithoutFeedback>
        <Modal
          style={styles.modal}
          backdropColor="transparent"
          isVisible={this.state.isVisible}
          onBackdropPress={this.toggleModal}>
          <View style={styles.close}>
            <TouchableOpacity onPress={this.toggleModal}>
              <Image
                source={require('../../../assets/close/close_BTN.png')}
                style={styles.closeImage}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <ScrollView
              style={styles.scroll}
              scrollIndicatorInsets={{right: 1}}
              ref={ref => {
                this.payScroll = ref;
              }}
              onContentSizeChange={(w, h) => {
                this.payScroll.scrollToEnd();
              }}>
              {this.state.categories != null && //Is loaded
                Array.from(this.state.categories).map(cat => {
                  if (cat.id) {
                    //loaded
                    const item = this.state.skus.find(
                      x => x.productId == cat.product_id,
                    );
                    if (item) {
                      //If data is loaded, remove (text), Play Store adds text to the title
                      item.title = item.title.replace(/ *\([^)]*\) */g, '');
                      return this.renderRow(item);
                    }
                  }
                })}
              {this.renderBuyAll()}
            </ScrollView>
            <TouchableOpacity
              style={styles.restoreButton}
              onPress={this.restorePurchases}>
              <Text style={styles.restoreButtonText}>
                {strings.restorePuchases}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }

  renderBuyAll() {
    const itemAll = this.state.skus.find(
      x => x.productId == 'videopackage_all',
    );
    if (itemAll) {
      itemAll.title = itemAll.title.replace(/ *\([^)]*\) */g, '');
      return this.renderRow(itemAll);
    }
  }

  /**
   * Render method for a row
   *
   * @param {any} item
   * @returns
   * @memberof PayModal
   */
  renderRow(item) {
    return (
      <View style={styles.item} key={item.productId}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <View style={styles.itemRow}>
          <Text style={styles.itemText} numberOfLines={2}>
            {item.description}
          </Text>
          {!this.state.own.find(x => x == item.productId) && (
            <TouchableOpacity
              style={styles.itemButton}
              onPress={() => this.buyProduct(item.productId)}>
              <Text numberOfLines={1} style={styles.itemButtonText}>
                {item.localizedPrice}{' '}
              </Text>
            </TouchableOpacity>
          )}
          {this.state.own.find(x => x == item.productId) && (
            <View style={styles.itemButton}>
              <Text numberOfLines={1} style={styles.itemButtonText}>
                OK
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
  /**
   * Restores purchases
   *
   * @memberof PayModal
   */
  restorePurchases = async () => {
    try {
      let purchases = await RNIap.getAvailablePurchases();
      let prodArray = [];

      if (purchases && purchases.length > 0) {
        purchases.forEach(purchase => {
          Sentry.captureMessage('Single purchase:');
          Sentry.captureMessage(purchase.productId);
          OneSignal.sendTags({
            have_paid: 'true',
            last_item: purchase.productId,
          });
          prodArray.push(purchase.productId);
        });
        AsyncStorage.setItem('Purchases', JSON.stringify(prodArray));
        this.setState({own: prodArray});
      }
      Sentry.captureMessage('All purchases:');
      Sentry.captureMessage(JSON.stringify(prodArray));
      this.toggleModal();
      this.reloadScreen();
    } catch (err) {
      Sentry.captureMessage(err);
      Alert.alert(strings.error, strings.unableToRestoreText);
    }

    this.reloadScreen();
  };
  /**
   * Reload screen to update state
   *
   * @memberof PayModal
   */
  reloadScreen() {
    const name = this.props.navigation.state.routeName;
    const params = this.props.navigation.state.params;
    this.props.navigation.pop();
    this.props.navigation.navigate(name, params);
  }

  /**
   * Buys a product from the store
   *
   * @param {any} id
   * @memberof PayModal
   */
  async buyProduct(id) {
    try {
      await RNIap.requestPurchase(id)
        .then(data => {
          this.acknowledgeProduct(data.purchaseToken);
          this.finishPurchase(data);
          //this.validateReceipt(data);
          OneSignal.sendTags({have_paid: 'true', last_item: id});
          Toast.show(strings.successBuy, Toast.LONG);
          Sentry.captureMessage('Bought:');
          Sentry.captureMessage(JSON.stringify(id));
          Sentry.captureMessage(id);
          this.setNewPurchase(id);
          this.reloadScreen();
        })
        .catch(error => {
          Alert.alert(strings.error, strings.unableToBuyText);
          Sentry.captureMessage(error);
        });
    } catch (error) {
      //Alert.alert(strings.error, strings.unableToBuyText);
      Sentry.captureMessage(error);
    }
  }
  /**
   * Sets a product in the state, and asyncstorage
   *
   * @param {any} id
   * @memberof PayModal
   */
  async setNewPurchase(id) {
    let allAsString = await AsyncStorage.getItem('Purchases');
    let all = [];
    if (allAsString != null) {
      all = JSON.parse(allAsString);
    }
    all.push(id);
    AsyncStorage.setItem('Purchases', JSON.stringify(all));
    this.setState({own: all});
    this.reloadScreen();
  }

  async validateReceipt(data) {
    RNIap.validateReceiptAndroid(
      data.packageNameAndroid,
      data.productId,
      data.purchaseToken,
    )
      .then(data => {
        console.log(data, 'receipt data');
      })
      .catch(error => {
        console.log(error, 'Error in validating receipt');
      });
  }

  async finishPurchase(data) {
    await RNIap.finishTransaction(data, true)
      .then(data => {
        console.log(data, 'finish transaction');
      })
      .catch(error => {
        console.log(error, 'finish error');
      });
  }

  async acknowledgeProduct(data) {
    await RNIap.acknowledgePurchaseAndroid(data)
      .then(data => {
        console.log(data, 'acknowledge');
      })
      .catch(error => {
        console.log(error, 'acknowldege error');
      });
  }
}
export default withNavigationFocus(PayModal);
