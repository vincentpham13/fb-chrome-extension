import Axios from 'axios';

const axios = Axios.create({
});

const API = {
  getFanpages: async (accessToken) => {
    const config = {
      method: 'get',
      url: `https://graph.facebook.com/me/accounts?fields=name,access_token&limit=100&access_token=${accessToken}`,
      headers: {
        'authority': 'graph.facebook.com',
        'accept': '*/*',
        'accept-language': 'vi,en-US;q=0.9,en;q=0.8,vi-VN;q=0.7',
      }
    };
    return (await axios(config)).data;
  },
  getPageMembers: async (pageID) => {
    const config = {
      method: 'get',
      url: `https://mbasic.facebook.com/messages/?pageID=${pageID}`,
      headers: {
        'authority': 'mbasic.facebook.com',
        'accept': '*/*',
        'accept-language': 'vi,en-US;q=0.9,en;q=0.8,vi-VN;q=0.7',
      }
    };
    const htmlContent = (await axios(config)).data;
    const uinfoRegex = /\/messages\/read\/\?tid=cid\.c\.([0-9]*).*?pageID=.*?fua">([\D]*?)</gm;

    const UIDs = [...(`${htmlContent}`.matchAll(uinfoRegex))].map(arr => ({
      uid: arr[1],
      name: arr[2],
    }));

    return UIDs;
  },
  getUserInfo: async (accessToken) => {
    const config = {
      method: 'get',
      url: `https://graph.facebook.com/v9.0/me?access_token=${accessToken}&debug=all&fields=name%2Cpicture&format=json&method=get&pretty=0&suppress_http_code=1&transport=cors`,
      headers: {
        'authority': 'graph.facebook.com',
        'content-type': 'application/x-www-form-urlencoded',
        'accept': '*/*',
        'accept-language': 'vi,en-US;q=0.9,en;q=0.8,vi-VN;q=0.7',
      }
    };

    const result = (await axios(config))?.data
    return {
      id: result?.id,
      name: result?.name,
      picture: result?.picture?.data.url,
    }
  },
}

export default API;
