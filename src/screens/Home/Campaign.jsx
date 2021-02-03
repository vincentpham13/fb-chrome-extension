import React, { useEffect, useState } from 'react';
import { withRouter, useRouteMatch } from 'react-router-dom';
import cx from 'classnames';

import API from '../../utils/Api';

import NormalButton from '../../components/Common/NormalButton';
import ProgressBar from '../../components/Common/ProgressBar';
import styles from './Home.module.scss';
import refreshIcon from '../../images/refresh-arrow.png';

const Campaign = (props) => {
  const {
    history,
    setDataTab1,
    fbAccessToken,
    goNext,
    initialData,
  } = props;

  const [fanpages, setFanpages] = useState([]);
  const [selectedPageID, setSelectedPageID] = useState(0);
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('');
  const [imageLink, setImageLink] = useState('');

  const onSelectedPageChange = (e) => {
    const { value } = e.target;
    if (value) {
      setSelectedPageID(value);
      setDataTab1({
        selectedPageID: value
      });
    }
  }

  const onCampaignNameChange = (e) => {
    const { value } = e.target;
    if (value) {
      setCampaignName(value);
      setDataTab1({
        campaignName: value
      });
    }
  }

  const onMessageChange = (e) => {
    const { value } = e.target;
    if (value) {
      setMessage(value);
      setDataTab1({
        message: value
      });
    }
  }

  const onImageLinkChange = (e) => {
    const { value } = e.target;
    if (value) {
      setImageLink(value);
      setDataTab1({
        imageLink: value
      });
    }
  }

  const reloadAllFanPages = async (e) => {
    const { data: pages } = await API.getFanpages(fbAccessToken);
    setFanpages(pages);
  }

  const gotoNextStep = () => {
    goNext();
    if (!campaignName || !message || !selectedPageID) {
      // alert('Thiếu dữ liệu');
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

  useEffect(() => {
    if (initialData) {
      setCampaignName(initialData?.campaignName);
      setMessage(initialData?.message);
      setSelectedPageID(initialData?.selectedPageID);

    }
  }, [initialData]);

  // Fetch fanpages
  useEffect(() => {
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
                  value={selectedPageID}
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
          <section className={cx(styles["menu-item"], styles["flex-direction-row"])}>
            <div className={cx(styles["col"], styles["col-flex-1"])}>
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
                  rows="10"
                  placeholder="Nội dung tin nhắn"
                ></textarea>
              </div>
            </div>
            <div className={cx(styles["col"], styles["col-40"])}>
              <div className={styles["headline"]}>
                Hình ảnh
                    </div>
              <div className={styles['input-text']}>
                <input
                  onChange={onImageLinkChange}
                  value={imageLink}
                  name=""
                  id=""
                  placeholder="Link hình ảnh"
                >
                </input>
              </div>
              <div className={styles["btn-upload"]}>
                <NormalButton
                  title="Tải từ máy tính"
                  type="primary"
                />
              </div>
            </div>
          </section>
          <section className={styles["menu-item"]}>
            <NormalButton
              disabled={!selectedPageID || !campaignName || !message}
              onClick={gotoNextStep}
              title="Kế tiếp"
            />
          </section>
        </div>
      </div>
    </>
  )
}

export default withRouter(Campaign);
