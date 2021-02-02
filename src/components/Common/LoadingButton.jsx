import React from 'react';
import cx from 'classnames';

import { Spinner } from 'reactstrap';
import styles from './Common.module.scss';

const LoadingButton = ({
  loading,
  ...rest
}) => {

  return (
    <div className={styles["btn-loading"]}>
      <button
        {...rest}
        disabled={loading}
      >
        {loading ? (
          <Spinner color="light" />
        ) : (
            <span className={styles['icon-send']} />
          )}

        {loading ? 'Đang gửi' : 'Gửi ngay'}
      </button>
    </div>
  )
}

export default LoadingButton;
