import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CONSTANTS from '../../constants';

export default function OnlyForCustomerHOC (Component, props) {
  const mapStateToProps = (state) => {
    return state.userStore;
  };

  class Hoc extends React.Component {
    componentDidMount () {
      const { data, data: { role } } = this.props;
      if (data) {
        if (role !== CONSTANTS.CUSTOMER) {
          this.props.history.replace('/');
        }
      }
    }

    render () {
      const { data, data: { role } } = this.props;

      return (
        <>
          {data && role === CONSTANTS.CUSTOMER && <Component/>}
        </>
      );
    }
  }

  Hoc.propTypes = {
    data: PropTypes.shape({
      role: PropTypes.string.isRequired
    }),
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired
    }).isRequired
  };

  return connect(mapStateToProps)(Hoc);
}
