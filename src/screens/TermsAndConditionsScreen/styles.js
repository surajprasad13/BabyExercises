import {Platform} from 'react-native';
import {isTablet} from 'react-native-device-detection';

export default {
  container: {
    padding: 25,
    paddingTop: Platform.OS === 'ios' ? 35 : 15,
  },

  innerContainer: {
    width: isTablet ? '70%' : '100%',
    alignSelf: 'center',
  },
  border: {
    borderWidth: 8,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  header: {
    backgroundColor: 'rgb(129,206,219)',
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
  },
  textContainer: {
    padding: 8,
    paddingBottom: 10,
  },

  paragraphs: {
    fontSize: 13,
  },

  switch: {
    alignSelf: 'flex-start',
    marginBottom: 50,
  },
};
