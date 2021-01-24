import React, { useEffect } from 'react';

import logo from '../../images/user.png';
import styles from './Common.module.scss';
import API from '../../utils/Api';

const Header = ({
  userInfo
}) => {
  
  return (
    <div className={styles["header-wrapper"]}>
      <div className={styles["user-info"]}>
        <img src={userInfo?.picture || null} alt="" className={styles["user-image"]} />
        <div className={styles["user-name"]}>{userInfo?.name || ''}</div>
      </div>
      <div className={styles["balance-info"]}>
        <div className={styles["balance-headline"]}>
          Số lượng tin nhắn còn lại
        </div>
        <div className={styles["balance-ammount"]}>
          999
        </div>

      </div>
    </div>
  )
}

export default Header;
