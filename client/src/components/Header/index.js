
import React, { Component } from 'react'

class Header extends Component {
  render () {
    return (
      <header>
        <h1 className="logo">Bucketly</h1>

        <ul>
          <li>
            <a href=''>Menu</a>
          </li>
        </ul>
      </header>
    )
  }
}

export default Header
