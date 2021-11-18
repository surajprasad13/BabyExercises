export default {
  container: {
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    flexWrap: 'wrap',
  },
  item: {
    width: '46%',
    margin: '2%',
  },
  imageBorder: {
    width: '100%',
    borderWidth: 5,
    borderColor: 'rgba(255,255,255, 0.2)',
  },
  image: {
    height: 70,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
  },

  ribbon: {
    position: 'absolute',
    top: 0,
    right: 0,
    resizeMode: 'contain',
  },

  centerImage: {
    alignSelf: 'center',
    height: '60%',
    resizeMode: 'contain',
  },
};
