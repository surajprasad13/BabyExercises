import OfflineFirstAPI from 'react-native-offline-api';
import Config from '@config/Config';
import * as Sentry from '@sentry/react-native';
import {} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_OPTIONS = {
  domains: {default: Config.API_URL},
  prefixes: {default: ''},
  debugApi: true,
  printNetworkRequests: true,
  disableCache: true,
  middlewares: [authMiddleware],
  cacheExpiration: 1000 * 60 * 60,
};

const API_SERVICES = {
  languages: {path: 'languages'},
  pages: {path: 'pages'},
  page: {path: 'page/:lang_iso/:page_id'},
  categories: {path: 'categories/:lang_iso '},
  recommend: {path: 'recommend/:lang_iso'},
  videos: {path: 'videos/:iso/:id'},
  videoData: {path: 'videoData/:iso/:vid_id'},
  video: {path: 'video/:id'},
  freeVideos: {path: 'freeVideos/:iso'},
  login: {
    path: 'login',
    method: 'POST',
    disableCache: true,
  },
};

const API_OPTIONS_NO_CACHE = {
  domains: {default: Config.API_URL},
  prefixes: {default: ''},
  debugApi: true,
  middlewares: [authMiddleware],
  printNetworkRequests: true,
  disableCache: true,
};

const API_OPTIONS_LOGIN = {
  domains: {default: Config.API_URL},
  prefixes: {default: ''},
  debugApi: true,
  printNetworkRequests: true,
  disableCache: true,
};

let token = null;

const api = new OfflineFirstAPI(API_OPTIONS, API_SERVICES);
const loginApi = new OfflineFirstAPI(API_OPTIONS_LOGIN, API_SERVICES);
const nocacheApi = new OfflineFirstAPI(API_OPTIONS_NO_CACHE, API_SERVICES);

async function authMiddleware(serviceDefinition, serviceOptions) {
  let authToken = await AsyncStorage.getItem('token');

  token = authToken;
  if (authToken == null) {
    console.log('token null');
    try {
      let data = {email: 'app@app.app', password: 'appapp'};
      console.log('bef');
      // const authData = await loginApi.post('login', { fetchOptions: { body: JSON.stringify(data) } });
      // Somehow the offline API didn't work unless inspecting network data
      let response = await fetch(`${Config.API_URL}/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'app@app.app',
          password: 'appapp',
        }),
      });
      console.log('res', response);
      let authData = await response.json();

      console.log('authData', authData);
      authToken = authData.token;
      AsyncStorage.setItem('token', authToken);
      return {headers: {Authorization: 'Bearer ' + authToken}};
    } catch (err) {
      console.log(err);
    }
  }

  return {headers: {Authorization: 'Bearer ' + authToken}};
}

export default class Data {
  /**
   * Fetches languages
   *
   * @static
   * @returns
   * @memberof Data
   */
  static async getLanguages() {
    console.log(api);
    const som = await api.fetch('languages');
    console.log('after');
    return som;
  }
  /**
   * Fetches categories (for the HomePage)
   *
   * @static
   * @returns
   * @memberof Data
   */
  static async getCategories(iso) {
    const categories = await api.fetch('categories', {
      pathParameters: {lang_iso: iso},
    });
    return categories;
  }
  /**
   *
   * Fetces the simple text pages
   *
   * @static
   * @returns
   * @memberof Data
   */
  static async getPages() {
    const pages = await api.fetch('pages');
    return pages;
  }

  /**
   *
   * Fetches a specific page in a specific language
   *
   * @static
   * @param {string} iso
   * @param {int} id
   * @returns
   * @memberof Data
   */
  static async getPage(iso, id) {
    const page = await api.fetch('page', {
      pathParameters: {lang_iso: iso, page_id: id},
    });

    return page;
  }
  /**
   *
   * Fetches the recommonmendation in a specific language
   *
   * @static
   * @param {string} iso
   * @returns
   * @memberof Data
   */
  static async getRecommend(iso) {
    const recommend = await nocacheApi.fetch('recommend', {
      pathParameters: {lang_iso: iso},
    });
    return recommend;
  }
  /**
   *
   * Fetches array of videos for a category and language
   *
   * @static
   * @param {any} iso
   * @param {any} productId
   * @returns
   * @memberof Data
   */
  static async getVideos(iso, productId) {
    const videos = await api.fetch('videos', {
      pathParameters: {iso: iso, id: productId},
    });
    return videos.videos;
  }

  static async getVideo(id) {
    const video = await api.fetch('video', {
      pathParameters: {id: id},
    });
    return video;
  }

  static async getVideoData(iso, id) {
    const videoData = await api.fetch('videoData', {
      pathParameters: {iso: iso, vid_id: id},
    });
    return videoData;
  }

  static async getFreeVideos(iso) {
    const videoArr = await api.fetch('freeVideos', {
      pathParameters: {iso: iso},
    });
    return videoArr;
  }
}
