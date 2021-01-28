import Axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';
// const BASE_URL = 'https://api-extension.hana.ai/api/v1';

const axios = Axios.create({
  withCredentials: true,
});

const API = {
  getFanpages: async (accessToken) => {
    console.log('Leila Vaughn')
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
  getSyncedFanpages: async (accessToken) => {
    console.log('Della Duncan')
    const config = {
      method: 'GET',
      url: `${BASE_URL}/fanpages`,
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${accessToken}`
      },
      withCredentials: true
    };

    const data = (await axios(config))?.data
    if (data.length) {
      return data;
    }

    return [];
  },
  syncPageMembers: async (pageID, nextUrl) => {
    console.log('Annie Rice')
    const config = {
      method: 'get',
      url: !nextUrl ? `https://mbasic.facebook.com/messages/?pageID=${pageID}` : nextUrl,
      headers: {
        'authority': 'mbasic.facebook.com',
        'accept': '*/*',
        'accept-language': 'vi,en-US;q=0.9,en;q=0.8,vi-VN;q=0.7',
      }
    };
    const htmlContent = (await axios(config)).data;
    const uinfoRegex = /\/messages\/read\/\?tid=cid\.c\.([0-9]*).*?pageID=.*?fua">([\D]*?)</gm;
    const nextPageRegex = /<a\shref=\"(\/messages\/\?pageNum=\d+&amp;selectable&amp;pageID=.*)"><span>/g;

    const UIDs = [...(`${htmlContent}`.matchAll(uinfoRegex))].map(arr => ({
      uid: arr[1],
      name: arr[2],
    }));

    if (!UIDs.length) {
      return [];
    }

    const matched = [...`${htmlContent}`.matchAll(nextPageRegex)];
    const nextPageUrl = matched.length && (matched[0][1]).replaceAll('amp;', '');

    return nextPageUrl ? [
      ...UIDs,
      ...(await API.syncPageMembers(pageID, `https://mbasic.facebook.com${nextPageUrl}`))
    ] : UIDs;
  },
  getPageMembers: async (accessToken, pageID) => {
    const config = {
      method: 'GET',
      url: `${BASE_URL}/fanpages/${pageID}/members`,
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${accessToken}`
      },
      withCredentials: true
    };

    const data = (await axios(config))?.data
    return data;
  },
  getUserInfo: async (accessToken) => {
    console.log('Cody Perez')
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

    const data = (await axios(config))?.data
    if (data?.id && data?.name) {
      return {
        id: data?.id,
        name: data?.name,
        picture: data?.picture?.data.url,
      }
    }
    return null;
  },
  loginWithFbToken: async (userId, fbAccessToken) => {
    console.log('Gerald Castillo')
    const config = {
      method: 'post',
      url: `${BASE_URL}/auth/login/facebook`,
      headers: {
        'content-type': 'application/json',
      },
      data: {
        fbUserId: userId,
        accessToken: fbAccessToken,
      },
      withCredentials: true
    };

    const data = (await axios(config))?.data
    if (data?.accessToken && data?.user.name) {
      return {
        id: data.user.id,
        name: data.user.name,
        accessToken: data?.accessToken,
      }
    }

    return null;
  },
  getMe: async (accessToken) => {
    console.log('Gerald Castillo')
    const config = {
      method: 'GET',
      url: `${BASE_URL}/account/me`,
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${accessToken}`
      },
      withCredentials: true
    };

    const data = (await axios(config))?.data
    console.log("🚀 ~ file: Api.js ~ line 137 ~ getMe: ~ data", data)
    return data;
  },
  createCampaign: async (accessToken, name, pageId, totalMessages) => {
    console.log('Lela Briggs')
    const config = {
      method: 'post',
      url: `${BASE_URL}/campaigns`,
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${accessToken}`
      },
      data: {
        name,
        pageId,
        totalMessages,
      },
      withCredentials: true
    };

    const data = (await axios(config))?.data
    if (data?.id && data?.name) {
      return data;
    }

    return null;
  },
  updateMessageCount: async (accessToken, campaignId, count = 1) => {
    console.log('Marie Rhodes')
    const config = {
      method: 'put',
      url: `${BASE_URL}/campaigns/${campaignId}`,
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${accessToken}`
      },
      data: {
        success: count
      },
      withCredentials: true
    };

    const data = (await axios(config))?.data
    return data;
  },
  importMembers: async (accessToken, pageId, members) => {
    console.log('Lucille Brooks')
    const config = {
      method: 'post',
      url: `${BASE_URL}/fanpages/${pageId}/member/import`,
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${accessToken}`
      },
      data: { members },
      withCredentials: true
    };

    const data = (await axios(config))?.data
    if (data.length) {
      return data;
    }

    return [];
  },
  getPageCampaigns: async (accessToken, pageId) => {
    console.log('Nathaniel Holt')
    const config = {
      method: 'GET',
      url: `${BASE_URL}/fanpages/${pageId}/campaigns`,
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${accessToken}`
      },
      withCredentials: true
    };

    const data = (await axios(config))?.data
    if (data.length) {
      return data;
    }

    return [];
  },
}

export default API;
