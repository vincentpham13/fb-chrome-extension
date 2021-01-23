
import React from 'react';
import cx from 'classnames';

import styles from './Common.module.scss';

const ProgressBar = ({
  percent,
  ...rest
}) => {

  return (
    <div
      className={cx(styles["progress-striped"], styles["progress"], styles[`${percent === 100 ? '' : 'progress-animate'}`])}
      {...rest}
    >
      <span className={styles["bg-red"]} style={{ width: `${percent}%` }}>{percent < 100 ? `${percent}%` : 'Completed!'}</span>
    </div>
  )
}

export default ProgressBar;
