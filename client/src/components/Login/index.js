import React, { Component } from 'react'

import Footer from '../Footer'
import { Link } from 'react-router-dom'

class Login extends Component {
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
