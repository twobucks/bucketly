import React, { Component } from 'react'
import Auth0LockPasswordless from 'auth0-lock-passwordless'

import Footer from '../Footer'
import { Link } from 'react-router-dom'

class Login extends Component {
  componentDidMount () {
    const lock = new Auth0LockPasswordless(process.env.REACT_APP_AUTH0_CLIENT_ID, process.env.REACT_APP_AUTH0_DOMAIN)

    lock.socialOrMagiclink({
      primaryColor: "#000000",
      connections: ["github", "twitter"],
      dict: {
        title: "Log in",
        welcome: "Log in"
      },
      container: "root",
      icon: "/twobucks.png"
    })
  }
  render () {
    return (
      <div>
        <div className='login'>
          <h1>Login</h1>
          <div className='form-section'>
            <form action='' method='post'>
              <label>Email</label>
              <input className='email' type='' name='' />
            </form>
            <Link to='/images' className='btn reverse'>Login with Github</Link>
            <Link to='/images' className='btn reverse'>Login with Twitter</Link>
          </div>
        </div>

        <Footer />
      </div>
    )
  }
}

export default Login
