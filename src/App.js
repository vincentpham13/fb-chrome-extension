import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";


import Login from './screens/Login/Login';
import Home from './screens/Home/Home';

function App() {

  return (
    <Router>
      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Switch>
        <Route
          exact
          path="/"
          render={() => {
            return (
              <Redirect to="/login" />
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
          <>Test</>
        </Route>
      </Switch>
    </Router>

  );
}

export default App;
