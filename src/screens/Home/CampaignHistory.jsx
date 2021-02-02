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

  const statusCampaign = (status) => {
    switch (status) {
      case 'pending':
        return 'Đang chờ';
      case 'running':
        return 'Đang chạy';
      case 'completed':
        return 'Hoàn tất';
      default:
        return 'Không xác định';
    }
  }

  useEffect(() => {
    async function fetchSyncedFanpages() {
      setLoading(true);
      const pages = await API.getSyncedFanpages(accessToken);
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
                  <th width={"60px"}>ID</th>
                  <th>Tên chiến dịch</th>
                  <th width={"100px"}>Ngày tạo</th>
                  <th width={"80px"}>Số lượng tin nhắn</th>
                  <th width={"80px"}>Thành công</th>
                  <th width={"100px"}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {
                  campaigns.map(campaign => (
                    <tr key={campaign.id}>
                      <td width={"60px"}>{campaign.id}</td>
                      <td>{campaign.name}</td>
                      <td width={"100px"}>{new Date(campaign.createdAt).toLocaleDateString('en-GB')}</td>
                      <td width={"80px"}>{campaign.totalMessages}</td>
                      <td width={"80px"}>{campaign.successMessages}</td>
                      <td width={"100px"}>{statusCampaign(campaign.status)}</td>
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
