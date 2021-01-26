// const BASE_URL = 'http://localhost:5000/api/v1';
const BASE_URL = 'https://api-extension.hana.ai/api/v1';

const successURL = 'https://www.facebook.com/connect/login_success.html';
const options = {
  type: "basic",
  title: "Facebook Page Authentication Successful",
  message: "Now you can send messages to your page's members!",
  iconUrl: "logo192.png"
}

const accessTokenFromSuccessURL = (url) => {
  const hashSplit = url.split('#');
  if (hashSplit.length > 1) {
    const paramsArray = hashSplit[1].split('&');
    for (const i = 0; i < paramsArray.length; i++) {
      const paramTuple = paramsArray[i].split('=');
      if (paramTuple.length > 1 && paramTuple[0] == 'access_token')
        return paramTuple[1];
    }
  }
  return null;
}

const onTabUpdated = (tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url.indexOf(successURL) === 0) {
    const accessToken = accessTokenFromSuccessURL(changeInfo.url);
    chrome.notifications.create(`fb-connect-success-${new Date().getTime()}`, options, (notificationId) => {
    });
    chrome.storage.sync.set({ 'FBaccessToken': accessToken }, function () {
    });
    chrome.tabs.remove(tabId);
    chrome.tabs.onUpdated.removeListener(onTabUpdated);
  }
}

const updateMessageCount = (accessToken, campaignId, count = 1) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  var raw = JSON.stringify({ "success": count });

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(`${BASE_URL}/campaigns/${campaignId}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

let accessToken = '';
let campaignId = '';

const requestCompleted = ({
  url,
  type,
  statusCode,
  method,
}) => {
  if (type === "xmlhttprequest" && method === "GET" && statusCode === 200) {
    const regexPatterm = /https:\/\/m\.facebook\.com\/messages\/read\/\?fbid=([\d]*).*pageID=([\d]*)/g;
    const matched = [...url.matchAll(regexPatterm)];

    if (matched.length) {
      const [, UID, pageID] = matched[0];
      chrome.runtime.sendMessage(chrome.runtime.id, {
        type: "RECEIVE_COMPLETED_MESSAGE",
        data: {
          pageID: pageID,
          memberID: UID,
        },
      }, {
      }, function (response) {
        // decide whether to make api
        if(!response) {
          console.log(campaignId, accessToken);
          updateMessageCount(accessToken, campaignId, 1)
        }
      })
    }
  }
}

console.log('add onChanged, event');
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (changes?.accessToken?.newValue) {
    accessToken = changes?.accessToken?.newValue;
  }
  if (changes?.campaignId?.newValue) {
    campaignId = changes?.campaignId?.newValue;
  }
});

chrome.runtime.onInstalled.addListener(function () {
  console.log('installed');

  console.log('add onUpdated event');
  chrome.tabs.onUpdated.addListener(onTabUpdated);
  console.log('add onComplee, event');
  chrome.webRequest.onCompleted.addListener(requestCompleted, { urls: ['https://m.facebook.com/*'] })
});

