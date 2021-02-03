import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import API from '../../utils/Api';
import { useSuccessMessage } from './hooks';

import LoadingButton from '../../components/Common/LoadingButton';
import NormalButton from '../../components/Common/NormalButton';
import ProgressBar from '../../components/Common/ProgressBar';
import styles from './Home.module.scss';
import Noti from '../../utils/Notification';
import refreshIcon from '../../images/refresh-arrow.png';

const Main = (props) => {
  const {
    history,
    goBack,
    accessToken,
    setLoading,
    tab1Data: {
      selectedPageID,
      campaignName,
      message,
    }
  } = props;
  const [sending, setSending] = useState(false);

  const [pageMembers, setPageMembers] = useState([]);

  const [campaign, setCampaign] = useState();

  const [deliveredMessages, setDeliveredMessages] = useState([]);

  const [intervalMessageTime, setIntervalMessageTime] = useState(1);

  const decrementSecond = () => {
    if (intervalMessageTime > 1) {
      setIntervalMessageTime(intervalMessageTime - 1)
    }
  }

  const incrementSecond = () => {
    console.log('increment current', typeof intervalMessageTime);
    if (intervalMessageTime < 5) {
      setIntervalMessageTime(intervalMessageTime + 1)
    }
  }

  const onIntervalMessageTimeChage = (e) => {
    console.log('onchange current', intervalMessageTime);
    const val = parseInt(e.target.value, 10);
    console.log('onchange val', val);
    if (1 <= val && val <= 5) {
      setIntervalMessageTime(val)
    }
  }

  const onSelectedPageChange = (e) => {
    setSelectedPageID(e.target.value);
  }

  const sendMessages = async () => {
    // validate data
    if (
      !selectedPageID
      || intervalMessageTime > 5
      || intervalMessageTime < 1
      || !pageMembers.length
      || !campaignName
      || !message

    ) {
      Noti.show(
        "Chiến dịch",
        "Thiếu dữ liệu, vui lòng kiểm tra lại",
      );
    }

    const memberUIDs = pageMembers.map(member => member.uid);
    const campaign = await API.createCampaign(
      accessToken,
      campaignName,
      selectedPageID,
      memberUIDs,
      message,
    );

    if (!campaign) {
      Noti.show(
        "Chiến dịch",
        "Tạo chiến dịch không thành công",
      );
      return;
    }

    const startedCampaign = await API.startCampaign(accessToken, campaign.id);
    if (!startedCampaign) {
      return;
    }

    setCampaign(campaign);
    setSending(true);
    setDeliveredMessages([]);
    chrome.storage.sync.set({
      'campaignId': campaign.id, function() {
        console.log("🚀 ~ file: Main.jsx ~ line 81 ~ sendMessages ~ campaign.id", campaign.id)
      }
    });
    chrome.runtime.sendMessage('', {
      type: "SEND_MESSAGE_TO_PAGE_MEMBERS",
      data: {
        pageID: selectedPageID,
        message: message,
        memberIDs: pageMembers.map(mem => mem.uid),
        interval: intervalMessageTime,
      },
    }, {
    }, function (response) {
      console.log("🚀 ~ file: Home.jsx ~ line 106 ~ sendMessages ~ response", response)
    })
  }

  const saveAsDraft = async () => {
    // validate data
    if (
      !selectedPageID
      || intervalMessageTime > 5
      || intervalMessageTime < 1
      || !pageMembers.length
      || !campaignName
      || !message

    ) {
      Noti.show(
        "Chiến dịch",
        "Thiếu dữ liệu, vui lòng kiểm tra lại",
      );
    }

    const memberUIDs = pageMembers.map(member => member.uid);
    const campaign = await API.createCampaign(
      accessToken,
      campaignName,
      selectedPageID,
      memberUIDs,
      message,
    );

    if (!campaign) {
      Noti.show(
        "Chiến dịch",
        "Lưu chiến dịch không thành công",
      );
      return;
    } else {
      Noti.show(
        "Chiến dịch",
        "Đã lưu chiến dịch thành công",
      );
    }
    goBack();
  }

  const goBackToCampaign = () => {
    setPageMembers([]);
    setDeliveredMessages([]);
    goBack();
  }

  const syncPageMembers = async () => {
    try {
      setLoading(true);
      const members = await API.syncPageMembers(selectedPageID);
      if (members.length) {
        Promise.resolve(API.importMembers(accessToken, selectedPageID, members));
        setPageMembers(members);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  // Fetch members
  useEffect(() => {
    if (selectedPageID) {
      setLoading(true);
      console.log(selectedPageID)
      setSending(false);
      setDeliveredMessages([]);
      async function fetchMembers() {
        const members = await API.getPageMembers(selectedPageID, accessToken);

        if (members && members.length) {
          setPageMembers(members);
        }
        setLoading(false);
      }
      fetchMembers();
    }

  }, [selectedPageID]);

  const deliveredMessage = useSuccessMessage(accessToken, campaign?.id);

  useEffect(() => {
    if (deliveredMessage) {
      setDeliveredMessages(deli => [...(deli || []), deliveredMessage]);
    }
  }, [deliveredMessage]);

  useEffect(() => {
    if (deliveredMessages.length === pageMembers.length) {
      setSending(false);
    }
  }, [deliveredMessages]);

  const percent = Math.floor(deliveredMessages.length / (pageMembers.length || 1) * 100);

  return (
    <>
      <div className={styles["home-wrapper"]}>
        <div className={styles["menu-group"]}>
          <section className={styles["menu-item"]}>
            <div className={styles["headline"]}>
              Danh sách thành viên <div
                onClick={syncPageMembers}
                className={styles["btn-reload"]}
              >
                <img src={refreshIcon} alt="" />
              </div>
            </div>
            {/* <NormalButton
              onClick={syncPageMembers}
              title="Đồng bộ"
            /> */}
            <table className={styles["page-members"]}>
              <thead>
                <tr>
                  <th>UID</th>
                  <th>Tên người chat</th>
                </tr>
              </thead>
              <tbody>
                {
                  pageMembers.map(member => (
                    <tr key={member.uid}>
                      <td>{member.uid}</td>
                      <td>{member.name}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            {/* <button className={styles["reload"]}>
              Reload
            </button> */}
          </section>
          <section className={styles["menu-item"]}>
            <div className={styles["headline"]}>
              Khoảng cách mỗi tin nhắn
            </div>
            <div className={styles["timing-tool"]}>
              <div className={styles["icon"]}></div>
              <div className={styles["btn-timing"]}>
                <button
                  onClick={decrementSecond}
                >-</button>
                <input
                  type="number"
                  onChange={onIntervalMessageTimeChage}
                  value={intervalMessageTime}
                ></input>
                <button
                  onClick={incrementSecond}
                >+</button>
              </div>
            </div>
            <ProgressBar
              percent={percent}
            />
          </section>
          <section className={styles["menu-item"]}>
            <NormalButton
              onClick={goBackToCampaign}
              title="Trở lại"
            />
            <div className={styles["btn-group"]}>
              {
                !sending ? (<NormalButton
                  type="secondary"
                  onClick={saveAsDraft}
                  title="Để sau"
                />) : null
              }
              <LoadingButton
                onClick={sendMessages}
                loading={sending}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default withRouter(Main);
