import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ModalDropdown from 'react-native-modal-dropdown';
import Data from '@library/data';
import CommonDataManager from '@library/CommonDataManager';
import strings from '@config/strings';
import Config from '@config/Config';
import OneSignal from 'react-native-onesignal';
import * as Sentry from '@sentry/react-native';
import Events from '@library/events';

const styles = StyleSheet.create({
  row: {
    padding: 15,
    flexDirection: 'row',
  },
  dropdown: {
    height: 200,
  },
  image: {
    height: 25,
    width: 25,
    marginRight: 10,
    resizeMode: 'contain',
  },
  selectedImage: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
});

export default class LanguageSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }
  /**
   * Gets called before mount.
   * Gets languages from AsyncStorage or API
   *
   * @memberof LanguageSelector
   */
  async UNSAFE_componentWillMount() {
    try {
      //Get languages
      let selected = JSON.parse(await AsyncStorage.getItem('SelectedLanguage'));
      Data.getLanguages().then(data => {
        selected = data.languages.find(x => x.iso === strings.getLanguage()); //Find the language initially set on the terms page
        // if (selected == null) {
        //     selected = data.languages.find(x => x.iso === 'en');
        // }
        AsyncStorage.setItem('SelectedLanguage', JSON.stringify(selected));
        CommonDataManager.getInstance().setSelectedLanguage(selected);
        strings.setLanguage(selected.iso);

        this.setState({
          selectedLang: selected,
          languages: data.languages,
          isLoading: false,
        });
      });
    } catch (error) {
      Sentry.captureMessage(error);
    }
  }

  /**
   *
   *
   * @returns
   * @memberof LanguageSelector
   */
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <ModalDropdown
        style={{flex: 1, padding: 15}}
        dropdownStyle={styles.dropdown}
        onSelect={(idx, data) => this.onLanguageSelect(idx, data)}
        options={this.state.languages}
        renderRow={this.renderLanguageRow.bind(this)}>
        {this.renderLanguageSelect(
          CommonDataManager.getInstance().getSelectedLanguage(),
        )}
      </ModalDropdown>
    );
  }
  /**
   * On new language select
   * sets new language in AsyncStorage, strings and global
   *
   * @param {any} idx
   * @param {any} data
   * @memberof LanguageSelector
   */
  onLanguageSelect(idx, data) {
    try {
      AsyncStorage.setItem('SelectedLanguage', JSON.stringify(data));
      strings.setLanguage(data.iso);
      CommonDataManager.getInstance().setSelectedLanguage(data);
      OneSignal.sendTag('lang', data.iso);
    } catch (error) {
      Sentry.captureMessage(error);
    }
    this.setState({selectedLang: data});
    this.props.renderParent();
  }
  /**
   * Render method for selector
   *
   * @param {any} image
   * @returns
   * @memberof LanguageSelector
   */
  renderLanguageSelect(language) {
    return (
      <Image
        style={styles.selectedImage}
        source={{uri: Config.URL + language.image}}
      />
    );
  }
  /**
   * Render method for the row in the dropdown
   *
   * @param {any} rowData
   * @param {any} rowID
   * @param {any} highlighted
   * @returns
   * @memberof LanguageSelector
   */
  renderLanguageRow(rowData, rowID, highlighted) {
    return (
      <TouchableOpacity>
        <View style={styles.row}>
          <Image
            source={{uri: Config.URL + rowData.image}}
            style={styles.image}
          />
          <Text style={{color: 'black', fontFamily: 'Soho Gothic Pro'}}>
            {rowData.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
