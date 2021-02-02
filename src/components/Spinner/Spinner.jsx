
import React from 'react';
import cx from 'classnames';

import { Spinner as ReactSpinner } from 'reactstrap';
import styles from './Spinner.module.scss';

const Spinner = ({
  loading,
  withText,
  ...rest
}) => {

  return (
    <div
      className={cx(styles["spinner"], styles[`${loading ? 'active' : ''}`])}
      {...rest}
    >
      <span className={styles["ic-loading"]}>
        {withText ? (<div>Đang kiểm tra</div>) : null}
        <ReactSpinner color="success" />
      </span>
    </div>
  )
}

export default Spinner;
