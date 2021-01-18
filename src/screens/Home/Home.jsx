import React from 'react';

import styles from './Home.module.scss';
import refreshIcon from '../../images/refresh-arrow.png';

const Home = (props) => {
  return (
    <div className={styles["home-wrapper"]}>
      <div className={styles["menu-group"]}>
        <section className={styles["menu-item"]}>
          <div className={styles["headline"]}>
            Chọn Fanpage
          </div>
          <div className={styles["select-fanpage"]}>
            <div className={styles["fanpage"]}>
              <select className={styles["select-box"]}>
                <option>Kinh doanh online</option>
                <option>Mở rộng chiến lược kinh doanh</option>
                <option>Vé xe rẻ</option>
                <option>Bất động sản Sài Gòn</option>
                <option>Nhà đất xanh</option>
              </select>
            </div>
            <div className={styles["btn-reload"]}>
              <img src={refreshIcon} alt=""/>
            </div>
          </div>
        </section>
        <section className={styles["menu-item"]}>
          <div className={styles["headline"]}>
            Danh sách thành viên
          </div>
          <div className={styles["select-fanpage"]}>
            <div className={styles["fanpage"]}>
              <select className={styles["select-box"]}>
                <option>Kinh doanh online</option>
                <option>Mở rộng chiến lược kinh doanh</option>
                <option>Vé xe rẻ</option>
                <option>Bất động sản Sài Gòn</option>
                <option>Nhà đất xanh</option>
              </select>
            </div>
            <button className={styles["reload"]}>
              Reload
            </button>
          </div>
        </section>
        <section className={styles["menu-item"]}>
          <div className={styles["headline"]}>
            Khoảng cách mỗi tin nhắn
          </div>
          <div className={styles["select-fanpage"]}>
            <div className={styles["fanpage"]}>
              <select className={styles["select-box"]}>
                <option>Kinh doanh online</option>
                <option>Mở rộng chiến lược kinh doanh</option>
                <option>Vé xe rẻ</option>
                <option>Bất động sản Sài Gòn</option>
                <option>Nhà đất xanh</option>
              </select>
            </div>
            <button className={styles["reload"]}>
              Reload
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home;
