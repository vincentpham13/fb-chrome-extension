import React, { useEffect, useState } from 'react';
import { Link, BrowserRouter as Router, Switch, Route, useRouteMatch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import Header from "../../components/Common/Header";
import Campaign from './Campaign';
import Main from './Main';

const Home = (props) => {
  let { path, url } = useRouteMatch();
  console.log("🚀 ~ file: Home.jsx ~ line 10 ~ Home ~ path, url", path, url)

  const {
    history,
  } = props;
  // const { userInfo } = history.location.state;

  return (
    <Router >
      <nav>
        <ul>
          <li>
            <Link to={`${url}/`}>Home</Link>
          </li>
          <li>
            <Link to={`${url}/campaign`}>Campaign</Link>
          </li>
        </ul>
      </nav>
      <Header userInfo={{}} />
      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Switch>
        <Route exact path="/">
          <>Main</>
          {/* <Main /> */}
        </Route>
        <Route path={`${path}/campaign`}>
          <Campaign />
        </Route>
        <Route path={`${path}/review`}>
          <Main />
        </Route>
      </Switch>
    </Router>
  )
}

export default withRouter(Home);
