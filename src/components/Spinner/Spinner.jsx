
import React from 'react';
import cx from 'classnames';

import { Spinner as ReactSpinner } from 'reactstrap';
import styles from './Spinner.module.scss';

const Spinner = ({
  loading,
  withLabel,
  ...rest
}) => {

  return (
    <div
      className={cx(styles["spinner"], styles[`${loading ? 'active' : ''}`])}
      {...rest}
    >
      <span className={styles["ic-loading"]}>
        {withLabel ? (<div>Đang kiểm tra</div>) : null}
        <ReactSpinner color="success" />
      </span>
    </div>
  )
}

export default Spinner;
