import React, { useEffect, useState } from 'react';

function useSuccessMessage() {
  const [successMessage, setSuccessMessage] = useState();

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      const {
        type,
        data,
      } = message;

      switch (type) {
        case "RECEIVE_COMPLETED_MESSAGE":
          setSuccessMessage(data);
          break;
        default:
          break;
      }
    });
  }, [])

  return successMessage;
}

export {
  useSuccessMessage,
};
