import {Platform} from 'react-native';

export default {
  outerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
  },
  tabletImage: {
    resizeMode: 'contain',
    width: null,
    height: null,
    flex: 1,
    margin: 100,
  },
  container: {
    paddingLeft: 35,
    paddingRight: 35,
    flex: 0.6,
  },

  headline: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
  },
  categories: {
    borderWidth: 8,
    borderColor: 'rgba(255,255,255,0.2)',
    borderTopWidth: 0,
  },
  categoryItem: {
    height: 70,
    borderTopWidth: 7,
    borderTopColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryImage: {
    height: 55,
    width: 55,
    resizeMode: 'contain',
    marginLeft: 5,
  },
  videos: {
    flexDirection: 'column',
    marginRight: 10,
    alignItems: 'center',
    marginTop: -7,
  },
  textWrap: {
    flexGrow: 1,
    flexDirection: 'column',
  },
  categoryText: {
    fontSize: 18,
    color: 'white',
    marginTop: -7,
    textAlign: 'center',
    // fontFamily: Platform.OS == 'ios' ? 'Soho Gothic Pro' : 'Soho Gothic Pro Medium',
    // fontWeight: Platform.OS == 'ios' ? 'bold' : 'normal'
  },
  months: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    // fontFamily: Platform.OS == 'ios' ? 'Soho Gothic Pro' : 'Soho Gothic Pro Medium',
    // fontWeight: Platform.OS == 'ios' ? 'bold' : 'normal'
  },
  video: {
    fontSize: 14,
    color: 'white',
  },
  //Rattle
  rattleContainer: {
    borderWidth: 7,
    marginTop: 20,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  rattleInnerContainer: {
    alignItems: 'center',
    height: 70,
    flexDirection: 'row',
  },
  image: {
    width: 50,
    marginLeft: 15,
    resizeMode: 'contain',
  },
  rattleText: {
    fontSize: 18,
    textAlign: 'center',
    flexWrap: 'wrap',
    flex: 1,
    // fontFamily: Platform.OS == 'ios' ? 'Soho Gothic Pro' : 'Soho Gothic Pro Medium',
    // fontWeight: Platform.OS == 'ios' ? 'bold' : 'normal'
  },

  //Links

  links: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 100,
    justifyContent: 'center',
  },

  linkLeft: {
    marginRight: 20,
  },

  linkRight: {
    marginLeft: 20,
  },
  linkImage: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
};
