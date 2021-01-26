import React from 'react';
import {
  MemoryRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import Login from './screens/Login/Login';
import Home from './screens/Home/Home';
import Test from './screens/Test';

function App() {

  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={() => {
            return (
              <Redirect to="/test" />
            )
          }}
        />
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/test">
          <Test />
        </Route>
      </Switch>
    </Router>

  );
}

export default App;
