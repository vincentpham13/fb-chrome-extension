import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import API from '../../utils/Api';
import { useSuccessMessage } from './hooks';

import LoadingButton from '../../components/Common/LoadingButton';
import NormalButton from '../../components/Common/NormalButton';
import ProgressBar from '../../components/Common/ProgressBar';
import styles from './Home.module.scss';

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
      alert('Thiếu dữ liệu')
    }

    const campaign = await API.createCampaign(accessToken, campaignName, selectedPageID, pageMembers.length)
    if (!campaign) {
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

  const goBackToCampaign = () => {
    goBack();
  }

  // Fetch members
  useEffect(() => {
    if (selectedPageID) {
      setLoading(true);
      console.log(selectedPageID)
      setSending(false);
      setDeliveredMessages([]);
      async function fetchMembers() {
        const members = await API.getPageMembers(selectedPageID);
        if (members && members.length) {
          Promise.resolve(API.importMembers(accessToken, selectedPageID, members));
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
      const {
        pageID,
        memberID,
      } = deliveredMessage;

      if (pageID == selectedPageID) {
        if (!deliveredMessages.includes(memberID)) {
          setDeliveredMessages([
            ...deliveredMessages,
            memberID,
          ]);
        } else {
          console.warn('Duplicated completed message under memberID:', memberID);
        }
      }
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
              Danh sách thành viên
          </div>
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
            <LoadingButton
              onClick={sendMessages}
              loading={sending}
            />
          </section>
        </div>
      </div>
    </>
  )
}

export default withRouter(Main);
