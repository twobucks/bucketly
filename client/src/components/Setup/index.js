import React, { Component } from 'react'

import Footer from '../Footer'
import Header from '../Header'
import Loading from '../Loading'
import Auth from '../../utils/Auth'
import Request from '../../utils/Request'

class Setup extends Component {
  constructor (props) {
    super(props)

    this.save = this.save.bind(this)
    this.handleBucketNameChange = this.handleBucketNameChange.bind(this)
    this.handleAccessKeyChange = this.handleAccessKeyChange.bind(this)
    this.handleSecretKeyChange = this.handleSecretKeyChange.bind(this)

    this.state = {
      bucketName: '',
      awsAccessKey: '',
      awsSecretKey: ''
    }

    this.auth = new Auth()
  }

  componentWillMount () {
    Request.get('/api/tokens').then((response) => {
      this.setState({
        bucketName: response.data.s3_details.bucket_name,
        awsAccessKey: response.data.s3_details.aws_access_key,
        awsSecretKey: response.data.s3_details.aws_secret_key
      })
    })
  }

  save () {
    const { bucketName, awsSecretKey, awsAccessKey } = this.state

    this.setState({isLoading: true, message: 'Running AWS S3 configuration check...'})

    Request.post('/api/test', {
      bucket_name: bucketName,
      aws_secret_key: awsSecretKey,
      aws_access_key: awsAccessKey
    }).then((response) => {
      this.setState({isLoading: false, message: 'AWS S3 configuration check was successful.'})
      console.log('success')
    }).catch((error) => {
      this.setState({isLoading: false, message: error.response.data.error})
      console.log(error)
    })
  }

  handleBucketNameChange (event) {
    this.setState({bucketName: event.target.value})
  }

  handleAccessKeyChange (event) {
    this.setState({awsAccessKey: event.target.value})
  }

  handleSecretKeyChange (event) {
    this.setState({awsSecretKey: event.target.value})
  }

  render () {
    const buttonSection = this.state.isLoading
      ? <Loading />
      : <div className='btn reverse' onClick={this.save}>Save</div>

    if (!this.auth.isAuthenticated()) {
      return null
    }

    return (
      <div>
        <Header />
        <section className='setup'>
          <h1>Setup</h1>

          <p>1. Go to AWS dashboard page.</p>
          <p>2. Click the AWS credentials.</p>
          <div className='form-section'>
            <label>BUCKET NAME</label>
            <input className='text' type='' name='' value={this.state.bucketName} onChange={this.handleBucketNameChange} />
          </div>

          <div className='form-section'>
            <label>AWS ACCESS KEY</label>
            <input className='text' type='' name='' value={this.state.awsAccessKey} onChange={this.handleAccessKeyChange} />
          </div>

          <div className='form-section'>
            <label>AWS SECRET</label>
            <input className='text' type='' name='' value={this.state.awsSecretKey} onChange={this.handleSecretKeyChange} />
          </div>

          <div className='message-section'>
            {this.state.message}
          </div>

          {buttonSection}
        </section>

        <Footer />
      </div>
    )
  }
}

export default Setup
