import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import API from '../../utils/Api';
import styles from './Login.module.scss';
/* eslint-disable-rule no-undef */
const Login = (props) => {
  const { history } = props;
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
    'scope=public_profile,pages_show_list',
    'redirect_uri=' + successURL,
    'response_type=token',
    'display=popup'
  ];

  const query = queryParams.join('&');
  const authenticationUrl = path + query;

  const openAuthenticationUrl = () => {
    chrome.notifications.create(`fb-connect-start-${new Date().getTime()}`, options, (notificationId) => {
    });

    setTimeout(() => {
      chrome.tabs.create({
        'url': authenticationUrl,
      }, function (window) {
      });
    }, 500);
  }

  const logout = () => {
    chrome.storage.sync.set({
      'FBaccessToken': null, function() {
      }
    });
    chrome.storage.sync.set({
      'FBuserInfo': null, function() {
      }
    });
    history.push('/login');
  }

  const [fbAccessToken, setFbAccessToken] = useState();

  // Load fb access token
  useEffect(() => {
    chrome.storage.sync.get(['FBaccessToken'], function (data) {
      if (data?.FBaccessToken) {
        console.log("🚀 ~ file: Login.jsx ~ line 64 ~ data?.FBaccessToken", data?.FBaccessToken)
        setFbAccessToken(data?.FBaccessToken);
      } else {
        console.log('lgout');
        // remove all tokens then naviage to login
        logout();
      }
    });
  }, []);

  // Fetch users
  useEffect(() => {
    if (fbAccessToken) {
      async function checkValidFbToekenAndAccessToken() {
        const fbuser = await API.getUserInfo(fbAccessToken);
        if (fbuser) {
          const user = await API.loginWithFbToken(fbuser.id, fbAccessToken);
          history.push({
            pathname: '/home',
            state: {
              userInfo: fbuser,
              fbAccessToken,
              accessToken: user.accessToken,
            },
          })
        }
      }
      checkValidFbToekenAndAccessToken();
    }
  }, [fbAccessToken]);

  return (
    <div className={styles["Login_wrapper"]}>
      <button
        onClick={openAuthenticationUrl}
        className={styles["btn_connect"]}
      >
        Bắt đầu
      </button>
    </div>
  )
}

export default withRouter(Login);
