import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { restorePasswordAction, clearRestorePasswordAction } from '../../actions/actionCreator';
import FormInput from '../FormInput/FormInput';
import loginFormStyles from '../LoginForm/LoginForm.module.sass';
import styles from './RestorePasswordForm.module.sass';

const RestorePasswordForm = (props) => {

    const dispatch = useDispatch();
    const restorePassword = bindActionCreators(restorePasswordAction, dispatch);
    const clearState = bindActionCreators(clearRestorePasswordAction, dispatch);

    const { isFetching, data, error } = useSelector(state => state.restorePassword);
    
    const { handleSubmit } = props;

    useEffect(() => {
        return () => {
            clearState();
        }
    }, []);

    const submitHandler = (values) => {
        restorePassword(values)
    }
    
    const formInputClasses = {
      container: loginFormStyles.inputContainer,
      input: loginFormStyles.input,
      warning: loginFormStyles.fieldWarning,
      notValid: loginFormStyles.notValid,
      valid: loginFormStyles.valid,
    };

    if(data && !isFetching) {
        return (
            <div className={styles.success}>
                <span className="far fa-check-circle"></span>
                <span>{data}</span>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(submitHandler)}>
            <Field name='email' 
                classes={ formInputClasses }
                component={ FormInput }
                label="Email Address"
            />
            <Field name='password' 
                type='password'
                classes={ formInputClasses }
                component={ FormInput }
                label="Password"
            />
            <Field name='confirmPassword' 
                type='password'
                classes={ formInputClasses }
                component={ FormInput }
                label="Confirm Password"
            />
            <button type='submit' className={ loginFormStyles.submitContainer }>
                {isFetching ? <span>LOADING...</span> : <span>RESTORE PASSWORD</span>}
            </button>
        </form>
    )
}

export default reduxForm({
    form: 'restorePassword',
})(RestorePasswordForm)