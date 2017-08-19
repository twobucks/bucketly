/* global localStorage */
import auth0 from 'auth0-js'

export default class Auth {
  constructor () {
    this.logout = this.logout.bind(this)
    this.handleAuthentication = this.handleAuthentication.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN || 'foo',
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID || 'bar',
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL || 'baz',
      audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN || 'foo'}/userinfo`,
      responseType: 'token id_token',
      scope: 'openid profile'
    })
  }

  handleAuthentication (hash) {
    this.auth0.parseHash((err, authResult) => {
      console.log(authResult)
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
        this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
          if (err) {
            console.log(err)
          } else {
            console.log(profile)
            this.setProfile(profile)
          }
        })
      } else if (err) {
        console.log(err)
      }
    })
  }

  setProfile (profile) {
    localStorage.setItem('profile', JSON.stringify(profile))
  }

  setSession (authResult) {
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime())
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('state', authResult.state)
    localStorage.setItem('expires_at', expiresAt)
  }

  logout () {
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('state')
    localStorage.removeItem('expires_at')
  }

  isAuthenticated () {
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  }
}
