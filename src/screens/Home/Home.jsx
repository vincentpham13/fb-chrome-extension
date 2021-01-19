import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import Button from '../../components/Common/Button';
import API from '../utils/Api';
import Header from "../../components/Common/Header";
import styles from './Home.module.scss';
import refreshIcon from '../../images/refresh-arrow.png';

const Home = (props) => {
  const {
    history,
    accessToken = 'EAABwzLixnjYBAHIgZCDlzZBsBltlPGru9rBefyNRcxMTlu6v9Yw89B81flT2EoE8NRcHy1zZCrvuZBFtmyxlsa4qsZAXiGmQrEUpnz9JABWigOKVATqYWiRQDarOlnZBtOtxGSwA9Pku9OjuOI08wzKto6wwWLfqBAQTMZA1xZBMLpflG8fC7Lmw'
  } = props;

  const [fanpages, setFanpages] = useState([]);
  const [selectedPageID, setSelectedPageID] = useState();
  const [pageMembers, setPageMembers] = useState([
    {
      uid: 1213323232,
      name: 'pham hoang minh nhat',
    },
    {
      uid: 12133232322,
      name: 'pham hoang minh nhat',
    },
    {
      uid: 12133233232,
      name: 'pham hoang minh nhat',
    },
    {
      uid: 121332333232,
      name: 'pham hoang minh nhat',
    },
    {
      uid: 121332233232,
      name: 'pham hoang minh nhat',
    },
    {
      uid: 12133223233232,
      name: 'pham hoang minh nhat',
    },
    {
      uid: 12133232233232,
      name: 'pham hoang minh nhat',
    },
  ]);
  const [intervalMessageTime, setIntervalMessageTime] = useState(1)

  const logout = () => {
    chrome.storage.sync.set({
      'FBaccessToken': null, function() {
      }
    })
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
    if (!selectedPageID  || intervalMessageTime > 5 || intervalMessageTime < 1) {
      return;
    }

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

  useEffect(() => {
    async function fetchMembers() {
      const UIDs = await API.getPageMembers(selectedPageID);
      setPageMembers(UIDs);
    }
    fetchMembers();
  }, [selectedPageID]);

  useEffect(() => {
    // chrome.storage.onChanged.addListener(function (changes, namespace) {
    //   if (!changes?.FBaccessToken?.newValue) {
    //     history.push('/');
    //   }
    // });
    async function fetchFanpages() {
      const { data: pages } = await API.getFanpages(accessToken);
      setFanpages(pages);
    }
    fetchFanpages();
  }, []);

  return (
    <>
      <Header />
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
            <Button
              onClick={sendMessages}
              loading={false}
            />
          </section>
        </div>
        <button onClick={logout}>Logout</button>
      </div>
    </>
  )
}

export default withRouter(Home);
