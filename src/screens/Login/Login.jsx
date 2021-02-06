import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import API from '../../utils/Api';
import styles from './Login.module.scss';
import Spinner from '../../components/Spinner/Spinner';

/* eslint-disable-rule no-undef */
const Login = (props) => {
  const { history } = props;
  const options = {
    type: "basic",
    title: "Đăng nhập Facebook",
    message: "Bombot cần truy cập vào tài khoản của bạn",
    iconUrl: "logo.png"
  }

  const successURL = 'https://www.facebook.com/connect/login_success.html';
  const path = 'https://www.facebook.com/v9.0/dialog/oauth?';
  const appID = '4087907114572119';
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
  const [isChecking, setIsChecking] = useState(true);

  // Load fb access token
  useEffect(() => {
    chrome.storage.sync.get(['FBaccessToken'], function (data) {
      if (data?.FBaccessToken) {
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
      setIsChecking(true);
      async function checkValidFbToekenAndAccessToken() {
        try {
          const fbuser = await API.getUserInfo(fbAccessToken);
          if (fbuser) {
            const user = await API.loginWithFbToken(fbuser.id, fbAccessToken);
            if (user) {
              const me = await API.getMe(user.accessToken);
              history.push({
                pathname: '/home',
                state: {
                  userInfo: {
                    ...fbuser,
                    remainingMessages: me?.totalMessages == -1 ? 'Không giới hạn' : me?.totalMessages - me?.successMessages,
                  },
                  fbAccessToken,
                  accessToken: user.accessToken,
                },
              });
              chrome.storage.sync.set({
                'accessToken': user.accessToken, function() {
                }
              });
            }
          }
        } catch (error) {
          console.log("🚀 ~ file: Login.jsx ~ line 103 ~ checkValidFbToekenAndAccessToken ~ error", error)
          chrome.notifications.create(`fb-connect-start-${new Date().getTime()}`, {
            ...options,
            title: 'Có lỗi xảy xa',
            message: 'Token đã hết hạn'
          }, (notificationId) => {

          });
        } finally {
          setIsChecking(false);
        }
      }
      checkValidFbToekenAndAccessToken();
    } else {
      setIsChecking(false);
    }
  }, [fbAccessToken]);

  return (
    <div className={styles["Login_wrapper"]}>
      {!isChecking ? (<button
        onClick={openAuthenticationUrl}
        className={styles["btn_connect"]}
      >
        Bắt đầu
      </button>) : null}
      <Spinner withText loading={isChecking} />
    </div>
  )
}

export default withRouter(Login);
