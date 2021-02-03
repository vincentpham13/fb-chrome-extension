chrome.runtime.onInstalled.addListener(function () {
  console.log('backgroundApi - installed');
});

function createFileUpload(base64Image) {
  try {
    const blobBin = atob(base64Image.split(',')[1]);
    const array = [];

    for (let i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }

    const file = new Blob([new Uint8Array(array)], {
      type: 'image/jpg'
    });

    return file;
  } catch (error) {

  }
}

const executeRequests = function (tab, pageID, message, memberIDs = [], intervalTime, imageLink) {
  chrome.storage.sync.get(['accessToken'], async function (data) {
    if (data?.accessToken) {
      console.log('co access token');
      let blob = new Blob();
      try {
        if (imageLink) {
          blob = await ((await fetch(imageLink)).blob());
        }
      } catch (error) {
        console.log("🚀 Error while fetching image from url", error)
      } finally {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          var base64 = reader.result.length <= 5 ? '' : reader.result;
          console.log("🚀 ~ file: backgroundApi.js ~ line 40 ~ base64", base64)

          chrome.tabs.executeScript(tab.id, {
            code: `
              (async function execScript () {
              // util to convert base64 image to blob
              function createFileUpload(base64Image) {
                try {
                  const blobBin = atob(base64Image.split(',')[1]);
                  const array = [];
              
                  for (let i = 0; i < blobBin.length; i++) {
                    array.push(blobBin.charCodeAt(i));
                  }
              
                  const file = new Blob([new Uint8Array(array)], {
                    type: 'image/jpg'
                  });
              
                  return file;
                } catch (error) {
              
                }
              }

              var dtsg = document.getElementsByName("fb_dtsg");
              var fb_dtsg = dtsg[0].value;

              // Upload image
              var base64 = '${base64}';
              var file = base64 ? createFileUpload(base64) : new Blob();
              const formData = new FormData();
              formData.append('photo', file, 'photo.jpg');

              const options = {
                method: 'POST',
                body: formData,
                headers: {
                }
              };

              let res = base64 ? await (await fetch(\`https://m.facebook.com/_mupload_/photo/x/saveunpublished/?allow_spherical_photo=true&thumbnail_width=80&thumbnail_height=80&waterfall_id=cdc4d99f912a9fdbdacdce5719a5730f&waterfall_app_name=web_m_touch&waterfall_source=message&target_id=${pageID}&av=${pageID}&fb_dtsg=\${fb_dtsg}&jazoest=21873&m_sess=&__dyn=1KQEGiFoO13DzUjxC2GfGh0BBBgS5UqxKcwRxG9xu3Za1FwKwSwMxW4E2qxK4ohws82ywUx60GEeE2RwVwUwk9EdEnw9u0XoswvosyU6S1QzU1rEWUS0KU4a1PwBgao88C0NE2oCwSwaOfxW0D86i0N85G0zE5W0KE&__csr=&__req=8&__a=AYmdPOLBZMAnCuthlurQpd6vWtoOrsemk9BG7dCDLe1Ph1mR2eEi09GDGe-eC5ZkmGm0x-sfAbxn3ToCUGw9iBg2-LU9vtvlyXueXUgC8XmVUw\`,
      options)).text() : '';

              console.log('res', res);
              const matchedPhotoID= res.match(/\\"payload\\":{\\"fbid\\":\\"([\\d]*)\\"/);
              let photoId = matchedPhotoID?.length == 2 ? matchedPhotoID[1] : '';
              console.log(photoId);

              // Fetch API
              var myHeaders = new Headers();
              myHeaders.append("authority", "m.facebook.com");
              myHeaders.append("accept-language", "vi,en-US;q=0.9,en;q=0.8,vi-VN;q=0.7");
              myHeaders.append("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        
              var memberIDs = [${memberIDs.join(',')}];
          
              function getFetchRequest(memberID) {
                var raw = \`fb_dtsg=\${fb_dtsg}&jazoest=22088&body=${message}&photo_ids[\${photoId}]=\${photoId}&tids=cid.c.\${memberID}%3A${pageID}&wwwupp=C3&ids%5B\${memberID}%5D=\${memberID}&referrer=&ctype=&cver=legacy&csid=aaeaa273-40fb-4bac-8d28-9be5aa1c8361\`;
          
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
              }, ${intervalTime * 1000});
            })();
              `
          });
        }
      }

    } else {
      console.warn('Missing accesstoken to update remaining message')
    }
  });
}

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  console.log("🚀 ~ hj", message)
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
      case 'SEND_MESSAGE_TO_PAGE_MEMBERS':
        chrome.tabs.query({ url: 'https://m.facebook.com/*' }, function (tabs) {
          if (tabs.length) {
            const tab = tabs[0];
            executeRequests(tab, data.pageID, data.message, data.memberIDs, data.interval, data.imageLink);
          } else {
            chrome.tabs.create({
              'url': 'https://m.facebook.com',
              'active': false
              // 'type': 'panel',
              // 'state': 'fullscreen'
            }, function (tab) {
              executeRequests(tab, data.pageID, data.message, data.memberIDs, data.interval, data.imageLink);
            });
          }
        })
        sendResponse('done nha');
        break;
        sendResponse('done nha');
        break;
      default:
        sendResponse(true);
        break;
    }

  } catch (error) {
  }
})
