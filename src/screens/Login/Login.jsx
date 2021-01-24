import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import API from '../../utils/Api';
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

  const [userInfo, setUserInfo] = useState(null);
  const [fbAccessToken, setFbAccessToken] = useState({});

  // Load fb access token
  useEffect(() => {
    chrome.storage.sync.get(['FBaccessToken'], function (data) {
      setFbAccessToken(data?.FBaccessToken);
    })
  }, []);

  // Fetch users
  useEffect(() => {
    if (fbAccessToken) {
      async function fetchUser() {
        const user = await API.getUserInfo(fbAccessToken);
        if (user) {
          console.log("🚀 ~ file: App.js ~ line 34 ~ fetchUser ~ user", user)
          history.push({
            pathname: '/home',
            state: { userInfo: user },
          })
        }
      }
      fetchUser();
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
