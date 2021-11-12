import { isTablet } from 'react-native-device-detection';

export default {

  container: {
    flex: 1,
  },

  image: {
    height: isTablet ? 500 : 250,
    width: '100%',
    alignSelf: 'stretch',
    resizeMode: 'cover',
  },
  imageTitle: {
    backgroundColor: 'transparent',
    fontSize: 24,
  },
  navTitleView: {
    marginTop: -30,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  navTitle: {
    fontSize: 18,
    backgroundColor: 'transparent',
  },
  titleContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 32, height: 32,
  },
  contentContainer: {
    padding: 20,
  },
  innerContainer: {
    width: isTablet ? '70%' : '100%',
    alignSelf: 'center',
  },
  paragraphs: {
    fontSize: 13,
  },
  link: {
    color: 'red',
  },

  deviceInfo: {
    marginTop: 30,
  },
  headline: {
    fontSize: 18,
  }
};