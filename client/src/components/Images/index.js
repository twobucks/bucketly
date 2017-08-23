import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Footer from '../Footer'
import Header from '../Header'
import Auth from '../../utils/Auth'

class Images extends Component {
  constructor (props) {
    super(props)

    this.auth = new Auth()
  }
  render () {
    if (!this.auth.isAuthenticated()) {
      window.location = '/login'
      return null
    }
    return (
      <div>
        <Header />
        <section className='images'>
          <h1>Images</h1>

          <p>You have <b>0</b> images. </p>

          <p>
            <Link to='/setup' className='btn reverse'>Set up your account with S3</Link>
          </p>
        </section>
        <Footer />
      </div>
    )
  }
}

export default Images
