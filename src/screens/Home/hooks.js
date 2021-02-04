import React, { useEffect, useState } from 'react';
import API from '../../utils/Api';

function useSuccessMessage(accessToken, campaignId) {
  const [successMessage, setSuccessMessage] = useState();

  async function handler(message, sender, sendResponse) {
    const {
      type,
      data,
    } = message;

    switch (type) {
      case "RECEIVE_COMPLETED_MESSAGE":
        setSuccessMessage(new Date().getTime());
        console.log("🚀 ~ file: hooks.js ~ line 19 ~ campaignId", campaignId)
        await API.updateMessageCount(accessToken, campaignId, 1);
        break;
      default:
        break;
    }
    sendResponse('Submited on foreground, background just ignore this');
  }

  useEffect(() => {
    if (accessToken && campaignId) {
      setSuccessMessage(null);
      chrome.runtime.onMessage.addListener(handler);

      return () => chrome.runtime.onMessage.removeListener(handler);
    }
  }, [accessToken, campaignId])

  return successMessage;
}

export {
  useSuccessMessage,
};
