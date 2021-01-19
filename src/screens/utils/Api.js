import Axios from 'axios';

const axios = Axios.create({
});

const API = {
  getFanpages: async (access_token) => {
    const config = {
      method: 'get',
      url: 'https://graph.facebook.com/me/accounts?fields=name,access_token&limit=100&access_token=EAABwzLixnjYBAHIgZCDlzZBsBltlPGru9rBefyNRcxMTlu6v9Yw89B81flT2EoE8NRcHy1zZCrvuZBFtmyxlsa4qsZAXiGmQrEUpnz9JABWigOKVATqYWiRQDarOlnZBtOtxGSwA9Pku9OjuOI08wzKto6wwWLfqBAQTMZA1xZBMLpflG8fC7Lmw',
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
}

export default API;
