import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';


import NormalButton from '../../components/Common/NormalButton';
import ProgressBar from '../../components/Common/ProgressBar';
import styles from './Home.module.scss';
import refreshIcon from '../../images/refresh-arrow.png';

const Campaign = (props) => {
  const {
    history,
  } = props;

  return (
    <>
      <div className={styles["home-wrapper"]}>
        <div className={styles["menu-group"]}>
          <section className={styles["menu-item"]}>
            <div className={styles["headline"]}>
              Tạo chiến dịch
            </div>
            <div className={styles['input-text']}>
              <input type="text" placeholder="Tên chiến dịch" />
            </div>
          </section>
          <section className={styles["menu-item"]}>
            <div className={styles["headline"]}>
              Tin nhắn
            </div>
            <div className={styles['input-text']}>
              <textarea name="" id="" cols="30" rows="10" placeholder="Nội dung tin nhắn"></textarea>
            </div>
          </section>
          <NormalButton title="Tiếp"/>
        </div>
      </div>
    </>
  )
}

export default withRouter(Campaign);
