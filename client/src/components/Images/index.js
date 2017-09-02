import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Footer from '../Footer'
import Header from '../Header'
import Auth from '../../utils/Auth'
import Request from '../../utils/Request'
import './index.css'

class Images extends Component {
  constructor (props) {
    super(props)

    this.state = {
      count: 0,
      loaded: false
    }

    this.auth = new Auth()
    this.renderImages = this.renderImages.bind(this)
  }
  componentWillMount () {
    Request.get('/api/images').then((response) => {
      const { count, images } = response.data
      this.setState({ count, images, loaded: true })
    })
  }

  renderImages(){
    const images = this.state.images.map((image, index) => {
      return <li key={index}>
        <img src={image.url}/>
      </li>
    })

    return <ul>{images}</ul>
  }

  render () {
    if (!this.auth.isAuthenticated()) {
      window.location = '/login'
      return null
    }
    if (!this.state.loaded) {
      return null
    }

    const imageLabel = this.state.count === 1 ? "image" :
      "images"
    const content = this.state.count === 0 ?
      <p>
        <Link to='/setup' className='btn reverse'>Set up your account with S3</Link>
      </p> :
      this.renderImages()

    return (
      <div>
        <Header />
        <section className='images'>
          <h1>Images</h1>

          <p>You have <b>{this.state.count}</b> {imageLabel}. </p>

          {content}
        </section>
        <Footer />
      </div>
    )
  }
}

export default Images
