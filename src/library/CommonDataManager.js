import strings from '@config/strings';
import {
    StyleSheet,
    View,
    ActivityIndicator,
    TouchableOpacity,
    AsyncStorage,
    Image,
} from 'react-native';


export default class CommonDataManager {

    static myInstance = null;
    _selectedLanguage = { name: 'English', iso: 'en' };
    _strings = strings;
    _currentDownload = 1;
    _isDownloading = false;

    justDownloaded = [];

    /**
     * @returns {CommonDataManager}
     */
    static getInstance() {
        if (CommonDataManager.myInstance == null) {
            CommonDataManager.myInstance = new CommonDataManager();
        }
        return CommonDataManager.myInstance;
    }

    getStrings() {
        return this._strings;
    }

    getSelectedLanguage() {
        return this._selectedLanguage;
    }

    setSelectedLanguage(language) {
        this._selectedLanguage = language;
    }

    addDownload(item) {
        this.justDownloaded.push(item);
    }
    getAllJustDownloaded(){
        return this.justDownloaded;
    }

    getCurrentDownload(){
        return this._currentDownload;
    }
    setCurrentDownload(dl){
        this._currentDownload = dl;
    }
    addToCurrentDownload(){
        this._currentDownload = this._currentDownload + 1;
    }
    setIsDownloading(is){
        this._isDownloading = is;
    }
    getIsDownloading(){
        return this._isDownloading;
    }

}