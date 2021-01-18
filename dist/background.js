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
      console.log("🚀 ~ file: background.js ~ line 32 ~ chrome.notifications.create ~ notificationId", notificationId)
    });
    localStorage.setItem('FBaccessToken', accessToken, tabId);
    chrome.storage.sync.set({ 'FBaccessToken': accessToken }, function () {
      console.log('Value is set to ' + accessToken);
    });
    chrome.tabs.remove(tabId);
    // chrome.tabs.onUpdated.removeListener(onTabUpdated);
  }
}

chrome.runtime.onInstalled.addListener(function () {
  console.log('installed');
  chrome.tabs.onUpdated.addListener(onTabUpdated);
  console.log('add event');
});
