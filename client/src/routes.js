// src/routes.js
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import App from './components/App'
import About from './components/About'
import Auth from './utils/Auth'
import Images from './components/Images'
import Loading from './components/Loading'
import Login from './components/Login'
import NotFound from './components/NotFound'
import Setup from './components/Setup'

const auth = new Auth()

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication(nextState.location.hash)
    // we're using window.location here on purpose,
    // otherwise the token will not be set for the first request
    window.location = '/images'
  }
}

const Routes = (props) => (
  <Router {...props}>
    <Switch>
      <Route exact path='/' component={App} />
      <Route exact path='/about' component={About} />
      <Route exact path='/images' component={Images} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/setup' component={Setup} />
      <Route path='/callback' render={(props) => {
        handleAuthentication(props)
        return <Loading {...props} />
      }} />
      <Route path='*' component={NotFound} />
    </Switch>
  </Router>
)

export default Routes
