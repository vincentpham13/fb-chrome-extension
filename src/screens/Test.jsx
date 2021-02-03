import React, { useState } from 'react'
import classnames from 'classnames';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';

import styles from './Home/Home.module.scss';
import NormalButton from '../components/Common/NormalButton';

const Test = () => {
  const [activeTab, setActiveTab] = useState('1');

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  }


  return (
    <div className={styles["mylayout-wrapper"]}>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => { toggle('1'); }}
          >
            Gửi tin nhắn hàng loạt
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
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
                  <section className={classnames(styles["menu-item"], styles["flex-direction-row"])}>
                    <div className={classnames(styles["col"], styles["col-flex-1"])}>
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
                    <div className={classnames(styles["col"], styles["col-30"])}>
                      <div className={styles["headline"]}>
                        Hình ảnh
                    </div>
                      <div className={styles['input-text']}>
                        <input
                          // onChange={onMessageChange}
                          // value={message}
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
