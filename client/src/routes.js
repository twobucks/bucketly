// src/routes.js
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import App from './components/App'
import About from './components/About'
import Images from './components/Images'
import Login from './components/Login'
import NotFound from './components/NotFound'
import Setup from './components/Setup'

const Routes = (props) => (
  <Router {...props}>
    <Switch>
      <Route exact path='/' component={App} />
      <Route exact path='/about' component={About} />
      <Route exact path='/images' component={Images} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/setup' component={Setup} />
      <Route path='*' component={NotFound} />
    </Switch>
  </Router>
)

export default Routes
