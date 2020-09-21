import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import reducers from './reducers';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';

import thunk from 'redux-thunk';

import User from './components/user';
import Roles from './components/roles';
import Login from './components/login';

const middlewares = [thunk];


const store = createStore(
  reducers,
  applyMiddleware(...middlewares)
);

ReactDOM.render(
  <Provider store={store}>
    <div className="container">
      <Router>
        <Route exact path='/' component={Login}></Route>
        <Route exact path='/user' component={User}></Route>
        <Route exact path='/roles' component={Roles}></Route>
      </Router>
    </div>
  </Provider>
  , document.getElementById('root'));