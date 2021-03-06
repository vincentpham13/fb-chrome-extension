import React, { useState, useEffect } from 'react';
import cx from 'classnames';

import API from '../../utils/Api';
import styles from './Home.module.scss';
import refreshIcon from '../../images/refresh-arrow.png';
import emptyBox from '../../images/empty-box.png';
import NormalButton from '../../components/Common/NormalButton';

const CampaignHistory = ({
  accessToken,
  setLoading,
  goBack,
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

  const reloadPageCampaigns = async () => {
    try {
      setLoading(true);
      const syncedCampaigns = await API.getPageCampaigns(accessToken, selectedPageID);
      setCampaigns(syncedCampaigns?.length ? syncedCampaigns : []);
    } catch (error) {
      console.log("🚀 ~ file: CampaignHistory.jsx ~ line 55 ~ fetchPageCampaigns ~ error", error)
    } finally {
      setLoading(false);
    }
  }

  const prepareToRunCampaign = (campaignId) => {
    const campaign = campaigns.find(c => c.id == campaignId);
    goBack(campaign);
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
        try {
          setLoading(true);
          const syncedCampaigns = await API.getPageCampaigns(accessToken, selectedPageID);
          setCampaigns(syncedCampaigns?.length ? syncedCampaigns : []);
        } catch (error) {
          console.log("🚀 ~ file: CampaignHistory.jsx ~ line 55 ~ fetchPageCampaigns ~ error", error)
        } finally {
          setLoading(false);
        }
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
                  <option key={0} value={0}>Chọn Fanpage cần xem</option>
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
              <div
                onClick={reloadPageCampaigns}
                className={styles["btn-reload"]}
              >
                <img src={refreshIcon} alt="" />
              </div>
            </div>
            <table className={styles["page-members"]}>
              <thead>
                <tr>
                  <th width={"60px"}>ID</th>
                  <th>Tên chiến dịch</th>
                  <th width={"100px"}>Ngày tạo</th>
                  <th width={"80px"}>Số lượng tin nhắn</th>
                  <th width={"80px"}>Thành công</th>
                  <th width={"120px"}>Trạng thái</th>
                </tr>
              </thead>
              <tbody className={styles["responsive"]}>
                {
                  campaigns.length ? campaigns.map(campaign => (
                    <tr key={campaign.id}>
                      <td width={"60px"}>{campaign.id}</td>
                      <td>{campaign.name}</td>
                      <td width={"100px"}>{new Date(campaign.createdAt).toLocaleString('vi-VN')}</td>
                      <td width={"80px"}>{campaign.totalMessages}</td>
                      <td width={"80px"}>{campaign.successMessages}</td>
                      <td width={"120px"}>
                        {
                          campaign.status === 'pending' ? (
                            <NormalButton
                              title="Chạy ngay"
                              size="small"
                              type="secondary"
                              onClick={() => prepareToRunCampaign(campaign.id)}
                            />
                          ) : statusCampaign(campaign.status)
                        }
                      </td>
                    </tr>
                  )) : <img className={styles["empty"]} src={emptyBox} alt="" srcset=""/>
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
