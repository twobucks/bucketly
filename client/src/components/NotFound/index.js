import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './style.css';

export default class NotFound extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames('NotFound', className)} {...props}>
        <h1>
          404 <small>Not Found :(</small>
        </h1>
      </div>
                                );
  }
}

NotFound.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  staticContext: PropTypes.object
}
