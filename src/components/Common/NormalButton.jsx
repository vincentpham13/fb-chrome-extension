import React from 'react';
import cx from 'classnames';

import styles from './Common.module.scss';

const NormalButton = ({
  title,
  type = 'primary',
  ...rest
}) => {

  return (
    <div className={cx(styles["btn-normal"], styles[type])}>
      <button
        {...rest}
      >
        {title}
      </button>
    </div>
  )
}

export default NormalButton;
