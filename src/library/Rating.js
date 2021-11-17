import RatingRequestor from 'react-native-rating-requestor';
import {Platform} from 'react-native';
import * as StoreReview from 'react-native-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from '@config/strings';

let RatingTracker = new RatingRequestor(
  Platform.OS === 'ios' ? '853013104' : 'dat1.videoplatform.android.babyapp',
  {
    title:
      Platform.OS === 'ios'
        ? strings.ratingTitleIos
        : strings.ratingTitleAndroid,
    message: strings.ratingMessage,
    actionLabels: {
      decline: strings.no,
      delay: strings.later,
      accept: strings.okay,
    },
    shouldBoldLastButton: true,
    storeCountry: 'us',
    storeAppName: 'dat1.videoplatform.ios.babyapp', //ios
  },
);

export default async function Rating() {
  if (Platform.OS == 'ios') {
    if (StoreReview.isAvailable) {
      let countstring = await AsyncStorage.getItem('iosRateCount');
      if (countstring == null) {
        countstring = '0';
      }
      let count = parseInt(countstring);
      count++;
      if (count >= 3) {
        StoreReview.requestReview();
      }
      AsyncStorage.setItem('iosRateCount', count + '');
    } else {
      //Old iOS
      RatingTracker.handlePositiveEvent();
    }
  } else {
    //Android
    RatingTracker.handlePositiveEvent();
  }
}
