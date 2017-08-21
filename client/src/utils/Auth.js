/* global localStorage */
import auth0 from 'auth0-js'
import axios from 'axios'

export default class Auth {
  constructor () {
    this.logout = this.logout.bind(this)
    this.login = this.login.bind(this)
    this.handleAuthentication = this.handleAuthentication.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)

    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN || 'foo',
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID || 'bar',
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL || 'baz',
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: 'token id_token',
      scope: 'openid profile'
    })
  }

  handleAuthentication (hash) {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        this.login(authResult)
        this.setSession(authResult)
      } else if (err) {
        console.log(err)
      }
    })
  }

  setSession (authResult) {
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime())
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('state', authResult.state)
    localStorage.setItem('expires_at', expiresAt)
  }

  login (authResult) {
    const instance = axios.create({
      headers: {
        Authorization: `Bearer ${authResult.accessToken}`
      }
    })
    instance.post('/api/login')
  }

  logout () {
    localStorage.removeItem('access_token')
    localStorage.removeItem('state')
    localStorage.removeItem('expires_at')
  }

  getAccessToken () {
    return localStorage.getItem('access_token')
  }

  isAuthenticated () {
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  }
}
