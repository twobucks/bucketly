import auth0 from 'auth0-js'

export default class Auth {
  auth0 = new auth0({
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
    audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo`,
    responseType: 'token id_token',
    scope: 'openid'
  });

  constructor() {
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  handleAuthentication(hash) {
    const authResult = this.auth0.parseHash(hash)
    console.log(authResult)
    if (authResult && authResult.id_token) {
      this.setSession(authResult)
      this.auth0.getProfile(authResult.id_token, (error, profile) => {
        if (error) {
          console.log('Error loading the Profile', error)
        } else {
          this.setProfile(profile)
        }
      })
    }
  }

  setProfile(profile) {
    // Saves profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profile))
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expires_in * 1000) + new Date().getTime())
    localStorage.setItem('access_token', authResult.access_token)
    localStorage.setItem('id_token', authResult.id_token)
    localStorage.setItem('expires_at', expiresAt)
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}
