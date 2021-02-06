import React, { useState, useRef } from 'react'
import cx from 'classnames';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';

import styles from './Home/Home.module.scss';
import NormalButton from '../components/Common/NormalButton';
import userImage from '../images/user.png';
import File from '../utils/File';

const Test = () => {
  const fileRef = useRef();
  const [imageLink, setImageLink] = useState('');
  const [activeTab, setActiveTab] = useState('1');

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  const onImageLinkChange = (e) => {
    const { value } = e.target;
    setImageLink(value);
  }

  const openFileUpload = () => {
    fileRef.current.click();
  }

  const onFileChange = async (e) => {
    const [file] = e.target.files;
    const base64Image = await File.readImage(file);
    setImageLink(base64Image);
  }

  const resetImage = () => {
    setImageLink('');
    setImageLink('');
    fileRef.current.value = null;
  }

  return (
    <div className={styles["mylayout-wrapper"]}>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={cx({ active: activeTab === '1' })}
            onClick={() => { toggle('1'); }}
          >
            Gửi tin nhắn hàng loạt
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={cx({ active: activeTab === '2' })}
            onClick={() => { toggle('2'); }}
          >
            Lịch sử chiến dịch
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <div className={styles["home-wrapper"]}>
                <div className={styles["menu-group"]}>
                  <section className={cx(styles["menu-item"], styles["flex-direction-row"])}>
                    <div className={cx(styles["col"], styles["col-flex-1"])}>
                      <div className={styles["headline"]}>
                        Tin nhắn
                    </div>
                      <div className={styles['input-text']}>
                        <textarea
                          // onChange={onMessageChange}
                          // value={message}
                          name=""
                          id=""
                          cols="73"
                          rows="10"
                          placeholder="Nội dung tin nhắn"
                        ></textarea>
                      </div>
                    </div>
                    <div className={cx(styles["col"], styles["col-30"])}>
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
                        <input
                          // value={message}
                          onChange={onFileChange}
                          ref={fileRef}
                          type="file"
                          name=""
                          id="file"
                        >
                        </input>
                        <NormalButton
                          onClick={openFileUpload}
                          title="Tải từ máy tính"
                          type="secondary"
                        />
                      </div>
                      <div className={styles["preview-image"]}>
                        {/* <p>Xem trước</p> */}
                        <span
                          onClick={resetImage}
                          className={cx(styles["ico-delete"], styles[`${imageLink ? 'show' : ''}`])}
                        ></span>
                        <img src={imageLink} alt="" />
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col sm="12">
              <h4>Tab 2 Contents</h4>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  )
}

export default Test
