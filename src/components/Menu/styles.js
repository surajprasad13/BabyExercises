import {Platform} from 'react-native';

export default {
  container: {
    flex: 1,
    borderLeftColor: 'white',
    borderLeftWidth: 4,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  },
  menuItem: {
    borderTopWidth: 7,
    padding: 15,
    paddingRight: 25,
    borderTopColor: 'rgba(255,255,255,0.4)',
  },
  border: {
    height: 7,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  menuItemText: {
    textAlign: 'right',
    fontSize: 25,
  },
  closeButton: {
    alignItems: 'flex-end',
  },
  closeImage: {
    height: 20,
    margin: 5,
    marginTop: 15,
    resizeMode: 'contain',
  },
  menuHeader: {
    fontSize: 25,
    textAlign: 'center',
    paddingBottom: 25,
  },
  baby: {
    width: 70,
    resizeMode: 'contain',
    flex: 1,
    alignSelf: 'center',
  },
};
