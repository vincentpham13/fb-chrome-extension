import React, { useEffect, useState } from 'react';
import API from '../../utils/Api';

function useSuccessMessage(accessToken, campaignId) {
  const [successMessage, setSuccessMessage] = useState();

  useEffect(() => {
    if (accessToken && campaignId) {
      chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
        const {
          type,
          data,
        } = message;

        switch (type) {
          case "RECEIVE_COMPLETED_MESSAGE":
            setSuccessMessage(new Date().getTime());
            await API.updateMessageCount(accessToken, campaignId, 1);
            break;
          default:
            break;
        }
        sendResponse('Submited on foreground, background just ignore this');
      });
    }
  }, [accessToken, campaignId])

  return successMessage;
}

export {
  useSuccessMessage,
};
