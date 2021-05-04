import React from 'react';

// eslint-disable-next-line react/prop-types
const AgreeTermOfServiceInput = ({ label, id, input, type, classes, meta: { touched, error } }) => {
  return (
        <div>
            {/* eslint-disable-next-line react/prop-types */}
            <div className={classes.container}>
                <input {...input} placeholder={label} id={id} type={type}/>
                <label htmlFor={id}>By clicking this checkbox, you agree to our
                    <a href="https://www.google.com" target={'_blank'} rel='noreferrer'>Terms of Service.</a>
                </label>
            </div>
            {/* eslint-disable-next-line react/prop-types */}
            {touched && (error && <span className={classes.warning}>{error}</span>)}
        </div>

  );
};

export default AgreeTermOfServiceInput;
