import React from 'react';
import { Link, MemoryRouter as Router, Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import Header from "../../components/Common/Header";
import Campaign from './Campaign';
import Main from './Main';

const Home = (props) => {
  let { path, url } = useRouteMatch();

  const {
    history,
  } = props;
  const {
    userInfo,
    fbAccessToken,
  } = history.location.state;

  return (
    <Router >
      {/* <nav>
        <ul style={{ display: "inline-flex" }}>
          <li>
            <Link to={`/home`}>Home</Link>
          </li>
          <li>
            <Link to={{
              pathname: `${url}/campaign`,
              state: {
                ...history.location.state
              }
            }}>Campaign</Link>
          </li>
        </ul>
      </nav> */}
      <Header userInfo={userInfo} />
      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Switch>
        <Route exact path="/" render={() => {
          return (
            <Redirect to={{
              pathname: `${url}/campaign`,
              state: {
                ...history.location.state
              }
            }} />
          )
        }} />
        <Route path={`${path}/review`}>
          <Main />
        </Route>
        <Route path={`${path}/campaign`}>
          <Campaign />
        </Route>
      </Switch>
    </Router>
  )
}

export default withRouter(Home);
