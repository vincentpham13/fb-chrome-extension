chrome.runtime.onInstalled.addListener(function () {
  console.log('backgroundApi - installed');
});

const executeRequests = function (tab, pageID, message, memberIDs = [], intervalTime) {
  chrome.tabs.executeScript(tab.id, {
    code: `
    var myHeaders = new Headers();
    myHeaders.append("authority", "m.facebook.com");
    myHeaders.append("accept-language", "vi,en-US;q=0.9,en;q=0.8,vi-VN;q=0.7");
    myHeaders.append("content-type", "application/x-www-form-urlencoded; charset=UTF-8");

    var memberIDs = [${memberIDs.join(',')}];
    var dbsg = document.getElementsByName("fb_dtsg");
    var fb_dtsg = dbsg[0].value;

    function getFetchRequest(memberID) {
      var raw = \`fb_dtsg=\${fb_dtsg}&jazoest=22088&body=${message}&tids=cid.c.\${memberID}%3A${pageID}&wwwupp=C3&ids%5B\${memberID}%5D=\${memberID}&referrer=&ctype=&cver=legacy&csid=aaeaa273-40fb-4bac-8d28-9be5aa1c8361&photo_ids%5B%5D=\`;

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    
      return fetch("https://m.facebook.com/messages/send/?icm=1&pageID=${pageID}&refid=12", requestOptions)
       .then(response => response.text())
       .then(result => console.log(result))
       .catch(error => console.log('error', error));
    }

    var reqIndex = 0;
    var interval = setInterval(function() {
      if (reqIndex === memberIDs.length) {
        clearInterval(interval);
        return;
      }

      console.log('starting', reqIndex, new Date().toLocaleString());
      getFetchRequest(memberIDs[reqIndex]);
      reqIndex++;
      console.log('done 1 cai');
    }, ${intervalTime * 1000})
    `
    // fetch("https://m.facebook.com/messages/send/?icm=1&pageID=${pageID}&refid=12", requestOptions)
    // .then(response => response.text())
    // .then(result => console.log(result))
    // .catch(error => console.log('error', error));
  });
}

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  try {
    const {
      type,
      data
    } = message;
    console.log("🚀 ~ file: backgroundApi.js ~ line 46 ~ message", message)

    let result;
    switch (type) {
      case 'GET_PAGE_MEMBERS':
        result = await getPageMembers(data.pageId);
        sendResponse(result);
        break;
      case 'SEND_MESSAGE_TO_PAGE_MEMBERS':
        chrome.tabs.query({ url: 'https://m.facebook.com/*' }, function (tabs) {
          if (tabs.length) {
            const tab = tabs[0];
            executeRequests(tab, data.pageID, data.message, data.memberIDs, data.interval);
          } else {
            chrome.tabs.create({
              'url': 'https://m.facebook.com',
              'active': false
              // 'type': 'panel',
              // 'state': 'fullscreen'
            }, function (tab) {
              executeRequests(tab, data.pageID, data.memberIDs, data.interval);
            });
          }
        })
        sendResponse('done nha');
        break;
      default:
        sendResponse(true);
        break;
    }

  } catch (error) {
  }
})
