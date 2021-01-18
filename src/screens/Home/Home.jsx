import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

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
  const [pageMembers, setPageMembers] = useState([]);
  const logout = () => {
    // chrome.storage.sync.set({
    //   'FBaccessToken': null, function() {
    //   }
    // })
  }

  const onSelectedPageChange = (e) => {
    setSelectedPageID(e.target.value);
  }

  const reloadAllFanPages = async (e) => {
    const { data: pages } = await API.getFanpages(accessToken);
    setFanpages(pages);
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
            <div className={styles["select-fanpage"]}>
              <div className={styles["fanpage"]}>
                <select className={styles["select-box"]}>
                  <option>Kinh doanh online</option>
                  <option>Mở rộng chiến lược kinh doanh</option>
                  <option>Vé xe rẻ</option>
                  <option>Bất động sản Sài Gòn</option>
                  <option>Nhà đất xanh</option>
                </select>
              </div>
              <button className={styles["reload"]}>
                Reload
            </button>
            </div>
          </section>
        </div>
        <button onClick={logout}>Logout</button>
      </div>
    </>
  )
}

export default withRouter(Home);
