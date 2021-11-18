import {isTablet} from 'react-native-device-detection';

export default {
  wrapper: {
    flexDirection: 'row',
    flex: 1,
  },

  sideView: {
    padding: 20,
    paddingTop: 0,
    width: '50%',
  },
  container: {
    padding: 30,
    paddingTop: 10,
    justifyContent: 'center',
  },
  border: {
    borderWidth: 7,
    borderColor: 'rgba(255,2552,255,0.2)',
    width: '100%',
  },
  thumbnail: {
    height: isTablet ? 250 : 150,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    margin: 10,
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
  },
  lengthLabel: {
    backgroundColor: 'rgb(250,80,121)',
    padding: 5,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  centerImage: {
    alignSelf: 'center',
    height: '60%',
    resizeMode: 'contain',
  },
};
