import React from 'react';
import cx from 'classnames';

import styles from './Common.module.scss';

const NormalButton = ({
  title,
  ...rest
}) => {

  return (
    <div className={styles["btn-normal"]}>
      <button
        {...rest}
      >
        {title}
      </button>
    </div>
  )
}

export default NormalButton;
