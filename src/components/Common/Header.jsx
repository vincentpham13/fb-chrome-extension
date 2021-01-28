import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import styles from './Common.module.scss';
import API from '../../utils/Api';
import exitIcon from '../../images/exit.png';

const Header = ({
  userInfo,
  remainingMessages,
  history
}) => {

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

  return (
    <div className={styles["header-wrapper"]}>
      <div className={styles["user-info"]}>
        <img src={userInfo?.picture || null} alt="" className={styles["user-image"]} />
        <div className={styles["user-name"]}>{userInfo?.name || ''}</div>
        <img onClick={logout} className={styles["btn-exit"]} src={exitIcon} alt="exit icon" />
      </div>
      <div className={styles["balance-info"]}>
        <div className={styles["balance-headline"]}>
          Số lượng tin nhắn còn lại
        </div>
        <div className={styles["balance-ammount"]}>
          {remainingMessages}
        </div>

      </div>
    </div>
  )
}

export default withRouter(Header);
