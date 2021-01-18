import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import styles from './Login.module.scss';
/* eslint-disable-rule no-undef */
const Login = (props) => {
  const { history } = props;
  const [authenticated, setAuthenticated] = useState();
  const options = {
    type: "basic",
    title: "Facebook authentication",
    message: "Grant your FB access to extension!",
    iconUrl: "logo192.png"
  }

  const successURL = 'https://www.facebook.com/connect/login_success.html';
  const path = 'https://www.facebook.com/v9.0/dialog/oauth?';
  const appID = '1263314497389233';
  const queryParams = [
    'client_id=' + appID,
    // 'auth_type=rerequest',
    'scope=public_profile',
    'redirect_uri=' + successURL,
    'response_type=token',
    // 'display=popup'
  ];

  const query = queryParams.join('&');
  const authenticationUrl = path + query;

  const openAuthenticationUrl = () => {
    // chrome.notifications.create(`fb-connect-start-${new Date().getTime()}`, options, (notificationId) => {
    // });

    // setTimeout(() => {
    //   chrome.tabs.create({
    //     'url': authenticationUrl,
    //     // 'type': 'panel',
    //     // 'state': 'fullscreen'
    //   }, function (window) {
    //     // console.log("🚀 ~ file: Login.jsx ~ line 40 ~ openAuthenticationUrl ~ window | tab", window)
    //   });
    // }, 500);
  }

  const sendMsgtoBackground = () => {
    // chrome.runtime.sendMessage('', "this is message", {
    // }, function (response) {
    //   // console.log("🚀 ~ file: Login.jsx ~ line 53 ~ sendMsgtoBackground ~ response", response)
    // })
  }

  useEffect(() => {
    // chrome.storage.sync.get(['FBaccessToken'], function (result) {
    //   setAuthenticated(result['FBaccessToken']);
    //   if (result['FBaccessToken']) {
    //     history.push('/home');
    //   } else {
    //     chrome.storage.onChanged.addListener(function (changes, namespace) {
    //       if (!changes?.FBaccessToken?.newValue) {
    //         setAuthenticated(false);
    //       }
    //     });
    //   }

    //   return () => chrome.storage.onChanged.removeListener()
    // })
  }, []);

  return (
    <div className={styles["Login_wrapper"]}>
      {/* <h1>Authenticate your facebook page</h1> */}
      {/* <p>{new Date().toISOString()}</p> */}
      <button
        disabled={authenticated}
        onClick={openAuthenticationUrl}
        className={styles["btn_connect"]}
      >
        {authenticated ? 'Connected' : 'Bắt đầu'}
      </button>
    </div>
  )
}

export default withRouter(Login);
