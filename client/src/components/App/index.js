// src/components/App/index.js
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './style.css'

import Footer from '../Footer'

class App extends Component {
  render () {
    return (
      <div className='landing'>
        <header>
          <h1 className='logo'>Bucketly</h1>

          <ul>
            <li>
              <Link to='/login'>Login</Link>
            </li>
            <li>
              <Link to='/login' className='btn'>Start free trial</Link>
            </li>
          </ul>
        </header>
        <section className='initial'>
          <div className='left'>
            <h1>Screenshot sharing <br /> for developers</h1>
            <p>Affordable screenshot sharing, using your own S3. Start your 30 day free trial now.</p>

            <Link to='/login' className='btn'>Start your free trial now</Link>
          </div>

          <div className='right'>
            <img src='/MBPR.png' alt='' />
          </div>

        </section>

        <Footer />
      </div>
    )
  }
}

export default App
