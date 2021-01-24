import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import API from '../../utils/Api';
import { useSuccessMessage } from './hooks';

import LoadingButton from '../../components/Common/LoadingButton';
import ProgressBar from '../../components/Common/ProgressBar';
import styles from './Home.module.scss';
import refreshIcon from '../../images/refresh-arrow.png';

const Main = (props) => {
  const {
    history,
  } = props;

  const [accessToken, setAccessToken] = useState({});
  const [sending, setSending] = useState(false);

  const [selectedPageID, setSelectedPageID] = useState(0);
  const [pageMembers, setPageMembers] = useState([]);

  const [deliveredMessages, setDeliveredMessages] = useState([]);
  const deliveredMessage = useSuccessMessage();

  const [intervalMessageTime, setIntervalMessageTime] = useState(1);

  const logout = () => {
    chrome.storage.sync.set({
      'FBaccessToken': null, function() {
      }
    });
    chrome.storage.sync.set({
      'FBuserInfo': null, function() {
      }
    });
  }

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

  const reloadAllFanPages = async (e) => {
    const { data: pages } = await API.getFanpages(accessToken);
    setFanpages(pages);
  }

  const sendMessages = () => {
    // validate data
    if (!selectedPageID || intervalMessageTime > 5 || intervalMessageTime < 1) {
      return;
    }

    setSending(true);
    setDeliveredMessages([]);

    chrome.runtime.sendMessage('', {
      type: "SEND_MESSAGE_TO_PAGE_MEMBERS",
      data: {
        pageID: selectedPageID,
        memberIDs: pageMembers.map(mem => mem.uid),
        interval: intervalMessageTime,
      },
    }, {
    }, function (response) {
      console.log("🚀 ~ file: Home.jsx ~ line 106 ~ sendMessages ~ response", response)
    })
  }

  // Fetch members
  useEffect(() => {
    setSending(false);
    setDeliveredMessages([]);
    async function fetchMembers() {
      const UIDs = await API.getPageMembers(selectedPageID);
      setPageMembers(UIDs);
    }
    fetchMembers();
  }, [selectedPageID]);

  // Get userinfo
  useEffect(() => {
    chrome.storage.sync.get(['FBuserInfo', 'FBaccessToken'], function (data) {
      setUserInfo(data?.FBuserInfo);
      setAccessToken(data?.FBaccessToken);
    })
  }, []);

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
            memberID
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
              Danh sách thành viên
          </div>
            <table className={styles["page-members"]}>
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>UID</th>
                </tr>
              </thead>
              <tbody>
                {
                  pageMembers.map(member => (
                    <tr key={member.uid}>
                      <td>{member.name}</td>
                      <td>{member.uid}</td>
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
            <LoadingButton
              onClick={sendMessages}
              loading={sending}
            />
            <ProgressBar
              percent={percent}
            />
          </section>
        </div>
        <button onClick={logout}>Logout</button>
      </div>
    </>
  )
}

export default withRouter(Main);
