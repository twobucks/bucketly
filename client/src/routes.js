// src/routes.js
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import App from './components/App'
import About from './components/About'
import NotFound from './components/NotFound'

const Routes = (props) => (
  <Router {...props}>
    <Switch>
      <Route exact path='/' component={App} />
      <Route exact path='/about' component={About} />
      <Route path='*' component={NotFound} />
    </Switch>
  </Router>
)

export default Routes
