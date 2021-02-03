import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import Header from "../../components/Common/Header";
import Campaign from './Campaign';
import CampaignHistory from './CampaignHistory';
import Main from './Main';
import Spinner from '../../components/Spinner/Spinner';
import styles from './Home.module.scss';

const Home = ({
  history,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [activeMainTab, setActiveMainTab] = useState('1');
  const [activeMessageTab, setActiveMessageTab] = useState('1');

  const [dataTab1, setDataTab1] = useState({
    selectedPageID: 0,
    campaignName: '',
    message: ''
  });

  const toggle = tab => {
    if (activeMainTab !== tab) setActiveMainTab(tab);
  }

  const goNextMessageTab = () => {
    setActiveMessageTab('2');
  }
  const goBackMessageTab = (data) => {
    setActiveMessageTab('1');
    if (data) {
      setActiveMainTab('1');
      setDataTab1({
        campaignId: data.id,
        selectedPageID: data.pageId,
        campaignName: data.name,
        message: data.message,
        memberUIDs: data?.memberUids,
      })
    }
  }

  const onReceiveDataTab1 = (data) => {
    setDataTab1({
      ...dataTab1,
      ...data
    })
  }

  const {
    userInfo,
    accessToken,
    fbAccessToken,
  } = history.location?.state ? history.location?.state : {};

  return (
    <div className={styles["home-wrapper"]}>
      <Header userInfo={userInfo} />
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeMainTab === '1' })}
            onClick={() => { toggle('1'); }}
          >
            Gửi tin nhắn hàng loạt
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeMainTab === '2' })}
            onClick={() => { toggle('2'); }}
          >
            Lịch sử chiến dịch
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeMainTab}>
        <TabPane tabId="1">
          <Row>
            <Col md="12">
              <TabContent activeTab={activeMessageTab}>
                <TabPane tabId="1">
                  <Row>
                    <Col md="12">
                      <Campaign
                        fbAccessToken={fbAccessToken}
                        accessToken={accessToken}
                        setDataTab1={onReceiveDataTab1}
                        initialData={dataTab1}
                        goNext={goNextMessageTab}
                      />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col md="12">
                      <Main
                        tab1Data={dataTab1}
                        accessToken={accessToken}
                        setLoading={setIsLoading}
                        goBack={goBackMessageTab}
                      />
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col md="12">
              <CampaignHistory
                goBack={goBackMessageTab}
                accessToken={accessToken}
                setLoading={setIsLoading}
              />
            </Col>
          </Row>
        </TabPane>
      </TabContent>
      <Spinner loading={isLoading} />
    </div>
  )
}

export default withRouter(Home);
