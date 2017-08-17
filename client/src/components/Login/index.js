import React, { Component } from 'react'
import auth0 from 'auth0-js'

import Footer from '../Footer'
import randomString from './../../utils/RandomString'

class Login extends Component {
  constructor (props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
    this.loginWithGithub = this.loginWithGithub.bind(this)
    this.loginWithTwitter = this.loginWithTwitter.bind(this)

    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID
    })
  }

  loginWithGithub (event) {
    event.preventDefault()

    this.auth0.authorize({
      connection: 'github',
      responseType: 'token',
      scope: 'openid profile',
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      nonce: randomString(10)
    })
  }

  loginWithTwitter (event) {
    event.preventDefault()

    this.auth0.authorize({
      connection: 'twitter',
      responseType: 'token',
      scope: 'openid profile',
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      nonce: randomString(10)
    })
  }

  onSubmit (event) {
    event.preventDefault()
    event.stopPropagation()

    const email = this.refs.email.value
    this.auth0.passwordlessStart({
      connection: 'email',
      send: 'link',
      email
    }, function (err, res) {
      if (err) console.log(err)
      // TODO: handle error/success
    })
  }
  render () {
    return (
      <div>
        <div className='login'>
          <h1>Login</h1>
          <div className='form-section'>
            <form action='' method='post' onSubmit={this.onSubmit}>
              <label>Email</label>
              <input ref='email' className='email' type='' name='' />
            </form>
            <a href='/images' className='btn reverse' onClick={this.loginWithGithub}>Login with Github</a>
            <a href='/images' className='btn reverse' onClick={this.loginWithTwitter}>Login with Twitter</a>
          </div>
        </div>

        <Footer />
      </div>
    )
  }
}

export default Login
