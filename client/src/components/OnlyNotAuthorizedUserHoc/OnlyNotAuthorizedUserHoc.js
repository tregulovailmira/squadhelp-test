import React from 'react';
import {onlyForNotAuthorize} from '../../actions/actionCreator';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import Spinner from '../Spinner/Spinner';


const OnlyNotAuthorizedUserHoc = (Component) => {

    const mapStateToProps = (state) => {
        return state.userStore;
    };

    const mapDispatchToProps = (dispatch) => {
        return {
            checkAuth: (data) => dispatch(onlyForNotAuthorize(data))
        }
    };

    class HocForLoginSignUp extends React.Component {
        componentDidMount() {
            this.props.checkAuth(this.props.history.replace);
        }

        render() {
            if (this.props.isFetching) {
                return <Spinner/>;
            } else if (!this.props.data) {
                return <Component history={this.props.history}/>
            }
            return null;
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(HocForLoginSignUp);
};


export default OnlyNotAuthorizedUserHoc;
