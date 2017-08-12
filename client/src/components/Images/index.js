import React, { Component } from 'react'

import Footer from '../Footer'
import Header from '../Header'
import { Link } from 'react-router-dom'

class Images extends Component {
  render () {
    return (
      <div>
        <Header />
        <section className="images">
          <h1>Images</h1>

          <p>You have <b>0</b> images. </p>

          <p>
            <Link to="/setup" className="btn reverse">Set up your account with S3</Link>
          </p>
        </section>
        <Footer />
      </div>
    )
  }
}

export default Images
