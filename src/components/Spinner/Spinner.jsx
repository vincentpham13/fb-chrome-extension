
import React from 'react';
import cx from 'classnames';

import { Spinner as ReactSpinner } from 'reactstrap';
import styles from './Spinner.module.scss';

const Spinner = ({
  percent,
  ...rest
}) => {

  return (
    <div
      className={cx(styles["spinner"], styles[`${true ? 'active' : ''}`])}
      {...rest}
    >
      <span className={styles["ic-loading"]}>
        <ReactSpinner color="success" />
      </span>
    </div>
  )
}

export default Spinner;
