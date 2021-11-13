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
    paddingLeft: 100,
    paddingRight: 100,
    flex: 0.6,
  },

  headline: {
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 20,
  },
  categories: {
    borderWidth: 12,
    borderColor: 'rgba(255,255,255,0.2)',
    borderTopWidth: 0,
  },
  categoryItem: {
    height: 105,
    borderTopWidth: 11,
    borderTopColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryImage: {
    height: 85,
    width: 85,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  videos: {
    flexDirection: 'column',
    marginRight: 10,
    alignItems: 'center',
    marginTop: -7,
  },
  categoryText: {
    fontSize: 60,
    color: 'white',
    marginTop: -7,
  },
  months: {
    fontSize: 27,
    color: 'white',
  },
  video: {
    fontSize: 20,
    color: 'white',
  },
  //Rattle
  rattleContainer: {
    borderWidth: 11,
    marginTop: 20,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  rattleInnerContainer: {
    alignItems: 'center',
    height: 105,
    flexDirection: 'row',
  },
  image: {
    width: 75,
    marginLeft: 15,
    resizeMode: 'contain',
  },
  rattleText: {
    fontSize: 30,
    textAlign: 'center',
    flexWrap: 'wrap',
    flex: 1,
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
    height: 60,
    width: 60,
    resizeMode: 'contain',
  },
};
