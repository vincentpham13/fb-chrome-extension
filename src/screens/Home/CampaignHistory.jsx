import React, { useState, useEffect } from 'react';
import cx from 'classnames';

import API from '../../utils/Api';
import styles from './Home.module.scss';

const CampaignHistory = ({
  accessToken,
  setLoading,
}) => {

  const [campaigns, setCampaigns] = useState([]);
  const [fanpages, setFanpages] = useState([]);
  const [selectedPageID, setSelectedPageID] = useState(0);

  const onSelectedPageChange = (e) => {
    const { value } = e.target;
    if (value) {
      setSelectedPageID(value);
    }
  }

  useEffect(() => {
    async function fetchSyncedFanpages() {
      setLoading(true);
      const pages= await API.getSyncedFanpages(accessToken);
      setLoading(false);
      setFanpages(pages?.length ? pages : []);
    }
    fetchSyncedFanpages();
  }, []);

  useEffect(() => {
    if (selectedPageID) {
      async function fetchPageCampaigns() {
        setLoading(true);
        const syncedCampaigns = await API.getPageCampaigns(accessToken, selectedPageID);
        setLoading(false);
        setCampaigns(syncedCampaigns?.length ? syncedCampaigns : []);
      }
      fetchPageCampaigns();
    }
  }, [selectedPageID]);

  return (
    <>
      <div className={styles["home-wrapper"]}>
        <div className={styles["menu-group"]}>
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
                  <option key={0} value={0}>Chọn Fanpage cần tra</option>
                  {
                    fanpages.map(fPage => (
                      <option key={fPage.id} value={fPage.id}>{fPage.name}</option>
                    ))
                  }
                </select>
              </div>
            </div>
          </section>
          <section className={cx(styles["menu-item"], styles["item-vertical"])}>
            <div className={styles["headline"]}>
              Chiến dịch đã chạy
          </div>
            <table className={styles["page-members"]}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên chiến dịch</th>
                  <th>Ngày tạo</th>
                  <th>Số lượng tin nhắn</th>
                  <th>Thành công</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {
                  campaigns.map(campaign => (
                    <tr key={campaign.id}>
                      <td>{campaign.id}</td>
                      <td>{campaign.name}</td>
                      <td>{new Date(campaign.createdAt).toLocaleDateString('en-GB')}</td>
                      <td>{campaign.totalMessages}</td>
                      <td>{campaign.successMessages}</td>
                      <td>{campaign.status}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            {/* <button className={styles["reload"]}>
              Reload
            </button> */}
          </section>
        </div>
      </div>
    </>
  )
}

export default CampaignHistory;
