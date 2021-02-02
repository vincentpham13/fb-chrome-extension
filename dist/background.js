const BASE_URL = 'http://localhost:5000/api/v1';
// const BASE_URL = 'https://api-extension.bombot.vn/api/v1';

const successURL = 'https://www.facebook.com/connect/login_success.html';
const options = {
  type: "basic",
  title: "Đăng nhập Facebook thành công",
  message: "Mở extension để gửi tin nhắn ngay",
  iconUrl: "logo.png"
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
  console.log("🚀 ~ file: background.js ~ line 27 ~ onTabUpdated ~ changeInfo.url", changeInfo.url)
  if (changeInfo.url && changeInfo.url.indexOf(successURL) === 0) {
    const accessToken = accessTokenFromSuccessURL(changeInfo.url);
    chrome.notifications.create(`fb-connect-success-${new Date().getTime()}`, options, (notificationId) => {
    });
    chrome.storage.sync.set({ 'FBaccessToken': accessToken }, function () {
    });
    chrome.tabs.remove(tabId);
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
  console.log("🚀 ~ file: background.js ~ line 66 ~ statusCode", url, type, statusCode)
  if (method === "GET" && statusCode === 200) {
    const regexPatterm = /https:\/\/m\.facebook\.com\/messages\/read\/\?fbid=([\d]*).*pageID=([\d]*)/g;
    const matched = [...url.matchAll(regexPatterm)];

    if (matched.length) {
      chrome.runtime.sendMessage(chrome.runtime.id, {
        type: "RECEIVE_COMPLETED_MESSAGE"
      }, {
      }, function (response) {
        // decide whether to make api
        if (!response) {
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


fetch("https://test.io/wp-content/uploads/2019/02/testIO-logo-rgb-2.png")
.then(function (response) {
  return response.blob()
})
.then(function (blob) {
  console.log("🚀 ~ file: background.js ~ line 110 ~ blob", blob);
  const formData = new FormData();
  formData.append('photo', blob, 'photo.jpg');

  const options = {
    method: 'POST',
    body: formData,
    // If you add this, upload won't work
    headers: {
    }
  };

  fetch("https://m.facebook.com/_mupload_/photo/x/saveunpublished/?allow_spherical_photo=true&thumbnail_width=80&thumbnail_height=80&waterfall_id=cdc4d99f912a9fdbdacdce5719a5730f&waterfall_app_name=web_m_touch&waterfall_source=message&target_id=686701998171599&av=686701998171599&fb_dtsg=AQHVvAI8C3MQ%3AAQFXS-g2pfF6&jazoest=21873&m_sess=&__dyn=1KQEGiFoO13DzUjxC2GfGh0BBBgS5UqxKcwRxG9xu3Za1FwKwSwMxW4E2qxK4ohws82ywUx60GEeE2RwVwUwk9EdEnw9u0XoswvosyU6S1QzU1rEWUS0KU4a1PwBgao88C0NE2oCwSwaOfxW0D86i0N85G0zE5W0KE&__csr=&__req=8&__a=AYmdPOLBZMAnCuthlurQpd6vWtoOrsemk9BG7dCDLe1Ph1mR2eEi09GDGe-eC5ZkmGm0x-sfAbxn3ToCUGw9iBg2-LU9vtvlyXueXUgC8XmVUw&__user=100003256970769",
    options)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
});