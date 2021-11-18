export default {
  container: {
    backgroundColor: 'black',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  back: {
    flexDirection: 'row',
    position: 'absolute',
    top: 20,
    left: 0,
  },

  backIcon: {
    height: 25,
    width: 25,
    marginLeft: 5,
    alignSelf: 'flex-start',
    resizeMode: 'contain',
  },
  backText: {
    height: 30,
    justifyContent: 'center',
    marginLeft: -7,
    marginTop: -3,
    alignSelf: 'flex-start',
  },
  player: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
};
