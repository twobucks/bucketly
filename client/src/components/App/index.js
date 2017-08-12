// src/components/App/index.js
import React, { Component } from 'react'

import logo from './logo.svg'
import './style.css'

class App extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render () {
    return (
      <div className='landing'>
        <header>
          <h1 className="logo">Bucketly</h1>

          <ul>
            <li>
              <a href=''>Login</a>
            </li>
            <li>
              <a href="/public/login.html" className="btn">Start free trial</a>
            </li>
          </ul>
        </header>
        <section className="initial">
          <div className='left'>
            <h1>Screenshot sharing <br/> for developers</h1>
            <p>Affordable screenshot sharing, using your own S3. Start your 30 day free trial now.</p>

            <a href="/public/login.html" className="btn">Start your free trial now</a>
          </div>

          <div className='right'>
            <img src='/public/MBPR.png' alt='' />
          </div>

        </section>

        <section className="pricing">
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

              <a href='/public/login.html' className='btn reverse'>
                Get started
              </a>
            </div>
          </div>
        </section>

        <footer>
          <a href="https://twobucks.co">Two Bucks</a> © 2017
        </footer>
      </div>
    )
  }
}

export default App
