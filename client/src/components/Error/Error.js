/* eslint-disable react/prop-types */
import React from 'react';
import cx from 'classnames';
import styles from './Error.module.sass';

const Error = props => {
  const getMessage = () => {
    const { status, data } = props
    switch (status) {
      case 404:
        return data
      case 400:
        return data || 'Check the input data'
      case 409:
        return data
      case 403:
        return data || 'Bank decline transaction'
      case 406:
        return data
      default:
        return data || 'Server Error'
    }
  }

  const { clearError, stylesClasses } = props;

  const errorStyles = cx(stylesClasses, styles.errorContainer);

  return (
        <div className={errorStyles}>
            <span>{getMessage()}</span>
            <i className="far fa-times-circle" onClick={() => clearError()}/>
        </div>
  )
}

export default Error
