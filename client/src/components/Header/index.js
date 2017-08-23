
import React, { Component } from 'react'

import Auth from '../../utils/Auth'

class Header extends Component {
  constructor (props) {
    super(props)

    this.logout = this.logout.bind(this)
    this.auth = new Auth()
  }
  logout () {
    this.auth.logout()
    window.location = '/login'
  }
  render () {
    return (
      <header>
        <h1 className='logo'>Bucketly</h1>

        <ul>
          <li>
            <a href='#' onClick={this.logout}>Log out</a>
          </li>
        </ul>
      </header>
    )
  }
}

export default Header
