import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePasswordAction } from '../../actions/actionCreator';

export default function RestorePasswordInfo(props) {

    const dispatch = useDispatch();
    const { data, isFetching } = useSelector(state => state.restorePassword);
    const updatePassword = bindActionCreators(updatePasswordAction, dispatch); 

    useEffect(() => {
        const { token } = props;
        updatePassword(token);
    }, [])

    return (
        <div style={{ color: 'white', textAlign: 'center', fontSize: '25px' }}>
            {isFetching ? <span>LOADING...</span> : data}
        </div>
    )
}
