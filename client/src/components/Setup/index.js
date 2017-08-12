import React, { Component } from 'react'

import Footer from '../Footer'
import Header from '../Header'
import { Link } from 'react-router-dom'

class Setup extends Component {
  render () {
    return (
      <div>
        <Header />
        <section className="setup">
          <h1>Setup</h1>

          <p>1. Go to AWS dashboard page.</p>
          <p>2. Click the AWS credentials.</p>

        </section>
        <Footer />
      </div>
    )
  }
}

export default Setup
