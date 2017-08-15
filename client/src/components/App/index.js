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

        <section className='pricing'>
          <div className='pricing-heading'>
            <h1>Pricing</h1>
          </div>
          <div className='pricing-table'>
            <div className='pricing-plan'>
              <h2>Free</h2>
              <ul>
                <li>
                  Host your own instance
                </li>
                <li>
                  <b>
                    $0/mo
                  </b>
                </li>
              </ul>
              <a href='https://github.com/twobucks/bucketly#readme' className='btn reverse'>
                Get started
              </a>
            </div>
            <div className='pricing-plan'>
              <h2>Private</h2>
              <ul>
                <li>
                  Unlimited screenshots
                </li>
                <li>
                  Dedicated support
                </li>
                <li>
                  Free 30 day trial - no credit card required
                </li>
                <li>
                  100% money back guarantee
                </li>
                <li>
                  <b>
                    $2/mo
                  </b>
                </li>
              </ul>

              <Link to='/login' className='btn reverse'>Get started</Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    )
  }
}

export default App
