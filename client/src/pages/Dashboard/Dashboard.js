/* eslint-disable react/prop-types */
import React from 'react';
import CONSTANTS from '../../constants';
import CustomerDashboard from '../../components/CustomerDashboard/CustomerDashboard';
import CreatorDashboard from '../../components/CreatorDashboard/CreatorDashboard';
import ModeratorDashboard from '../../components/ModeratorDashboard';
import Header from '../../components/Header/Header';
import { connect } from 'react-redux';

const Dashboard = (props) => {
  const { role, history } = props;
  return (
        <div>
            <Header/>
            { role === CONSTANTS.CUSTOMER && <CustomerDashboard history={history} match={props.match}/> }
            { role === CONSTANTS.CREATOR && <CreatorDashboard history={history} match={props.match}/> }
            { role === CONSTANTS.MODERATOR && <ModeratorDashboard history={history} match={props.match}/> }
        </div>
  );
};

const mapStateToProps = (state) => {
  return state.userStore.data;
};

export default connect(mapStateToProps)(Dashboard);
