chrome.runtime.onInstalled.addListener(function () {
  console.log('backgroundApi - installed');
});

function rewriteOrigin(e) {
  for (const header of e.requestHeaders) {
    if (header.name.toLowerCase() === "origin") {
    }
  }
  return { requestHeaders: e.requestHeaders };
}

chrome.webRequest.onBeforeSendHeaders.addListener(rewriteOrigin, { urls: ['https://m.facebook.com/*'] }, ["extraHeaders", "requestHeaders"]);

const executeRequests = function (tab) {
  chrome.tabs.executeScript(tab.id, {
    code: `
    const myHeaders = new Headers();
    myHeaders.append("authority", "m.facebook.com");
    myHeaders.append("accept", "text/plain, */*; q=0.01");
    myHeaders.append("accept-language", "vi,en-US;q=0.9,en;q=0.8,vi-VN;q=0.7");
    myHeaders.append("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36");
    myHeaders.append("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    myHeaders.append("origin", "https://m.facebook.com");
    myHeaders.append("sec-fetch-site", "same-origin");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("referer", "https://m.facebook.com/?ref=fchat.inbox&token=eyJpdiI6InNzTnNVRjlFU1U1VUthUXlvMDR1NVE9PSIsInZhbHVlIjoiYnZvaWs1cU9BMnFJQ3dVSXZvV05aY1hSYTBXbVRHd3Rhc08wQ2RxT2hcL29SNktPXC9ETWZHRk9kZzB3K2FcL29MQUJ2TXNnbzBjSTJJemtLUkI2U3FKbkE9PSIsIm1hYyI6IjA1OGE5YjA3ZTQ2MzE1MjkyNGRlZTVkNjA1NmMyNGZhMzFhOTc0ZDlmZTMwMjAxMzI0NDdlOTE0MGRmNGJiZTEifQ==");
    myHeaders.append("cookie", "sb=wkLnX_7vCkmrGW7xngt5wiOM; datr=wkLnXyR3rWo9oGTrIQGe7tUu; _fbp=fb.1.1610684047043.1945257182; dpr=2; locale=vi_VN; c_user=100003256970769; spin=r.1003190219_b.trunk_t.1610873640_s.1_v.2_; m_pixel_ratio=2; x-referer=eyJyIjoiL2hvbWUucGhwIiwiaCI6Ii9ob21lLnBocCIsInMiOiJtIn0%3D; presence=C%7B%22t3%22%3A%5B%7B%22i%22%3A%22g.2456201404509427%22%7D%5D%2C%22utc3%22%3A1610905256689%2C%22lm3%22%3A%22g.2456201404509427%22%2C%22v%22%3A1%7D; xs=14%3AYqP0hitMRBok6g%3A2%3A1610873639%3A13927%3A6161%3A%3AAcXzcPnzGpntGgrMUt9HseWkfwzE1aLARb-4bzUhyg; fr=0sjKSh1eDSAsnK3oh.AWU8OSCx2ZJY5k8lIkLr0IYBOz8.Bf5zMp.Ln.GAE.0.0.BgBOzK.AWXjsGGgMrA; wd=525x788; sb=ibQDYKQeal6a5jam3vORbB1t; c_user=100003256970769; xs=14%3AYqP0hitMRBok6g%3A2%3A1610873639%3A13927%3A6161%3A%3AAcVHxThlIcjPLlw7agFy-DIpQIVI78zJMHc8oAf9Ww; fr=0sjKSh1eDSAsnK3oh.AWV1TAtbPTuvS4pTBSEIkDYHh6c.Bf5zMp.Ln.AAA.0.0.BgBCXt.AWXnFjOK3ss");

    const raw = "fb_dtsg=AQGpOoVClIbF%3AAQGRSTSElZNs&jazoest=22088&body=%1Dhello+B%E1%BA%A1n+llll%0D%0A%0D%0A+%E2%9A%A1+fchat.ai&tids=cid.c.100004257035234%3A686701998171599&wwwupp=C3&ids%5B100004257035234%5D=100004257035234&referrer=&ctype=&cver=legacy&csid=aaeaa273-40fb-4bac-8d28-9be5aa1c8361&photo_ids%5B%5D=";

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://m.facebook.com/messages/send/?icm=1&pageID=686701998171599&refid=12", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    `
  });
}

const getPageMembers = async (pageID) => {
  const myHeaders = new Headers();
  myHeaders.append("authority", "mbasic.facebook.com");
  myHeaders.append("accept", "*/*");
  myHeaders.append("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36");
  myHeaders.append("sec-fetch-site", "none");
  myHeaders.append("sec-fetch-mode", "cors");
  myHeaders.append("sec-fetch-dest", "empty");
  myHeaders.append("accept-language", "vi,en-US;q=0.9,en;q=0.8,vi-VN;q=0.7");
  myHeaders.append("cookie", "sb=wkLnX_7vCkmrGW7xngt5wiOM; datr=wkLnXyR3rWo9oGTrIQGe7tUu; _fbp=fb.1.1610684047043.1945257182; dpr=2; m_pixel_ratio=2; locale=en_US; c_user=100003256970769; xs=44%3A7cyLP4R7ry1_dg%3A2%3A1610952349%3A13927%3A6161; spin=r.1003190480_b.trunk_t.1610952412_s.1_v.2_; presence=C%7B%22t3%22%3A%5B%7B%22i%22%3A%22g.2456201404509427%22%7D%5D%2C%22utc3%22%3A1610956095122%2C%22lm3%22%3A%22g.2456201404509427%22%2C%22v%22%3A1%7D; x-referer=eyJyIjoiL2hvbWUucGhwIiwiaCI6Ii9ob21lLnBocCIsInMiOiJtIn0%3D; fr=0sjKSh1eDSAsnK3oh.AWWhe5Py-KXfjaqo0kbBIW4D0pw.Bf5zMp.Ln.GAE.0.0.BgBYU-.AWVFUPcutHc; wd=1440x788; sb=ibQDYKQeal6a5jam3vORbB1t; c_user=100003256970769; xs=14%3AYqP0hitMRBok6g%3A2%3A1610873639%3A13927%3A6161%3A%3AAcVHxThlIcjPLlw7agFy-DIpQIVI78zJMHc8oAf9Ww; fr=0sjKSh1eDSAsnK3oh.AWV1TAtbPTuvS4pTBSEIkDYHh6c.Bf5zMp.Ln.AAA.0.0.BgBCXt.AWXnFjOK3ss");

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  return new Promise((resolve, reject) => {
    fetch("https://mbasic.facebook.com/messages/?pageID=107505540697747", requestOptions)
      .then(response => response.text())
      .then(result => {
        const uinfoRegex = /\/messages\/read\/\?tid=cid\.c\.([0-9]*).*pageID=.*?">([a-zA-Z\s]*)</gm;

        const UIDs = [...(`${result}`.matchAll(uinfoRegex))].map(arr => ({
          uid: arr[1],
          name: arr[2],
        }));

        resolve(UIDs);
      })
      .catch(error => reject(error));
  })
}

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  try {
    const {
      type,
      data
    } = message;

    let result;
    switch (type) {
      case 'GET_PAGE_MEMBERS':
        result = await getPageMembers(data.pageId);
        sendResponse(result);
        break;

      default:
        sendResponse(true);
        break;
    }
    // chrome.tabs.query({ url: 'https://m.facebook.com/*' }, function (tabs) {
    //   if (tabs.length) {
    //     const tab = tabs[0];
    //     executeRequests(tab);
    //   } else {
    //     chrome.tabs.create({
    //       'url': 'https://m.facebook.com',
    //       'active': false
    //       // 'type': 'panel',
    //       // 'state': 'fullscreen'
    //     }, function (tab) {
    //       executeRequests(tab);
    //     });
    //   }
    // })
  } catch (error) {
    console.log("🚀 ~ file: backgroundApi.js ~ line 20 ~ error", error)
  }
})
