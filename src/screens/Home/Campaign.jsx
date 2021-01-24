import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import API from '../../utils/Api';

import NormalButton from '../../components/Common/NormalButton';
import ProgressBar from '../../components/Common/ProgressBar';
import styles from './Home.module.scss';
import refreshIcon from '../../images/refresh-arrow.png';

const Campaign = (props) => {
  const {
    history,
  } = props;
  const {
    fbAccessToken,
  } = history.location.state || { fbAccessToken: 'rong' };

  const [fanpages, setFanpages] = useState([]);
  const [selectedPageID, setSelectedPageID] = useState(0);

  const onSelectedPageChange = (e) => {
    setSelectedPageID(e.target.value);
  }

  const reloadAllFanPages = async (e) => {
    const { data: pages } = await API.getFanpages(fbAccessToken);
    setFanpages(pages);
  }

  const gotoNextStep = () => {
    history.push({
      pathname: '/home/review',
      state: {
        selectedPageID: selectedPageID,
      }
    })
  }

  // Fetch fanpages
  useEffect(() => {
    // chrome.storage.onChanged.addListener(function (changes, namespace) {
    //   if (!changes?.FBaccessToken?.newValue) {
    //     history.push('/');
    //   }
    // });
    async function fetchFanpages() {
      const { data: pages } = await API.getFanpages(fbAccessToken);
      setFanpages(pages);
    }
    fetchFanpages();
  }, [fbAccessToken]);

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
              Chọn Fanpage
          </div>
            <div className={styles["select-fanpage"]}>
              <div className={styles["fanpage"]}>
                <select
                  onChange={onSelectedPageChange}
                  className={styles["select-box"]}
                >
                  <option key={0} value={0}>Chọn Fanpage để gửi tin nhắn</option>
                  {
                    fanpages.map(fPage => (
                      <option key={fPage.id} value={fPage.id}>{fPage.name}</option>
                    ))
                  }
                </select>
              </div>
              <div
                onClick={reloadAllFanPages}
                className={styles["btn-reload"]}
              >
                <img src={refreshIcon} alt="" />
              </div>
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
          <NormalButton
            disabled={!selectedPageID}
            onClick={gotoNextStep}
            title="Next"
          />
        </div>
      </div>
    </>
  )
}

export default withRouter(Campaign);
