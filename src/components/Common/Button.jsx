import React from 'react';
import cx from 'classnames';

import styles from './Common.module.scss';

const Button = ({
  loading
}) => {

  return (
    <div className={styles["btn-loading"]}>
      <button
        disabled={loading}
      >
        <span className={styles[`${loading ? 'icon-loading' : 'icon-send'}`]}></span>
        Gửi
      </button>
    </div>
  )
}

export default Button;
