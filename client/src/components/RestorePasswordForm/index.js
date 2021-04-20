import React from 'react';
import { Field, reduxForm } from 'redux-form';
import FormInput from '../FormInput/FormInput';
import loginFormStyles from '../LoginForm/LoginForm.module.sass';

const RestorePasswordForm = () => {
    const formInputClasses = {
      container: loginFormStyles.inputContainer,
      input: loginFormStyles.input,
      warning: loginFormStyles.fieldWarning,
      notValid: loginFormStyles.notValid,
      valid: loginFormStyles.valid,
    };
    return (
        <form>
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
                RESTORE PASSWORD
            </button>
        </form>
    )
}

export default reduxForm({
    form: 'restorePassword',
})(RestorePasswordForm)