import React from 'react';

import logo from '../../images/user.png';
import styles from './Common.module.scss';

const Header = (props) => {
  return (
    <div className={styles["header-wrapper"]}>
      <div className={styles["user-info"]}>
        <img src={logo} alt="" className={styles["user-image"]} />
        <div className={styles["user-name"]}>Phạm Hoàng Minh Nhật</div>
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
