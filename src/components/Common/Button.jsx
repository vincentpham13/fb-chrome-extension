import React from 'react';
import cx from 'classnames';

import styles from './Common.module.scss';

const Button = ({
  loading,
  ...rest
}) => {

  return (
    <div className={styles["btn-loading"]}>
      <button
        {...rest}
        disabled={loading}
      >
        <span className={styles[`${loading ? 'icon-loading' : 'icon-send'}`]}></span>
        {loading ? 'Đang gửi' : 'Gửi'}
      </button>
    </div>
  )
}

export default Button;
