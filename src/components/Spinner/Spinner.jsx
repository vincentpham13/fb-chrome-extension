
import React from 'react';
import cx from 'classnames';

import { Spinner as ReactSpinner } from 'reactstrap';
import styles from './Spinner.module.scss';

const Spinner = ({
  loading,
  ...rest
}) => {

  return (
    <div
      className={cx(styles["spinner"], styles[`${loading ? 'active' : ''}`])}
      {...rest}
    >
      <span className={styles["ic-loading"]}>
        <div>Đang kiểm tra</div>
        <ReactSpinner color="success" />
      </span>
    </div>
  )
}

export default Spinner;
