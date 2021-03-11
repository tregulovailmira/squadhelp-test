import React from 'react';
import {getUserAction} from '../../actions/actionCreator';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import Spinner from '../Spinner/Spinner';


const PrivateHoc = (Component, props) => {

    const mapStateToProps = (state) => {
        return state.userStore;
    };

    const mapDispatchToProps = (dispatch) => {
        return {
            getUser: (data) => dispatch(getUserAction(data))
        }
    };

    class Hoc extends React.Component {
        componentDidMount() {
            if (!this.props.data) {
                this.props.getUser(this.props.history.replace);
            }
        }

        render() {
            return (<>
                {this.props.isFetching ? <Spinner/> :
                    <Component history={this.props.history} match={this.props.match} {...props}/>}
            </>)
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(Hoc);
};


export default PrivateHoc;
