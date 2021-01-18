import {
  MemoryRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import logo from './logo.svg';
import styles from './App.module.scss';

import Login from './screens/Login/Login';
import Home from './screens/Home/Home';
import Header from "./components/Common/Header";

function App() {
  const logout = () => {
    console.log('remove');
    chrome.storage.sync.set({
      'FBaccessToken': null, function() {

      }
    })
    // chrome.storage.sync.remove('FBaccessToken', function(error, success) {

    // })
  }

  return (
    <Router>
      <div>
        <Header />
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav> */}

        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
        <footer>
        </footer>
      </div>
    </Router>
  );
}

export default App;
