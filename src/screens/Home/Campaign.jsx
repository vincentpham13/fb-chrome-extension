import React, { useEffect, useState } from 'react';
import { withRouter, useRouteMatch } from 'react-router-dom';

import API from '../../utils/Api';

import NormalButton from '../../components/Common/NormalButton';
import ProgressBar from '../../components/Common/ProgressBar';
import styles from './Home.module.scss';
import refreshIcon from '../../images/refresh-arrow.png';

const Campaign = (props) => {
  const {
    history,
  } = props;
  let { path, url } = useRouteMatch();

  const {
    fbAccessToken,
    accessToken,
  } = history.location.state || { fbAccessToken: 'rong' };

  const [fanpages, setFanpages] = useState([]);
  const [selectedPageID, setSelectedPageID] = useState(0);
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('');

  const onSelectedPageChange = (e) => {
    setSelectedPageID(e.target.value);
  }

  const onCampaignNameChange = (e) => {
    setCampaignName(e.target.value);
  }

  const onMessageChange = (e) => {
    setMessage(e.target.value);
  }

  const reloadAllFanPages = async (e) => {
    const { data: pages } = await API.getFanpages(fbAccessToken);
    setFanpages(pages);
  }

  const gotoNextStep = () => {
    if (!campaignName || !message || !selectedPageID) {
      alert('Thiếu dữ liệu');
      return;
    }

    history.push({
      pathname: '/home/review',
      state: {
        message,
        campaignName,
        selectedPageID,
        ...history.location.state,
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
              <input
                onChange={onCampaignNameChange}
                value={campaignName}
                type="text"
                placeholder="Tên chiến dịch"
              />
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
              <textarea
                onChange={onMessageChange}
                value={message}
                name=""
                id=""
                cols="30"
                rows="9"
                placeholder="Nội dung tin nhắn"
              ></textarea>
            </div>
          </section>
          <section className={styles["menu-item"]}>
            <NormalButton
              disabled={!selectedPageID}
              onClick={gotoNextStep}
              title="Next"
            />
          </section>
        </div>
      </div>
    </>
  )
}

export default withRouter(Campaign);
