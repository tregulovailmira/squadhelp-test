import React from 'react';
import classNames from 'classnames';

const FormInput = (props) => {

  const {label, input, type, classes, meta: {touched, error}} = props;

  const inputClassName = classNames(classes.input, {
    [classes.notValid]: touched && error,
    [classes.valid]: touched && !error,
  });

  return (
    <div className={ classes.container }>
      <input { ...input } placeholder={ label } type={ type }
             className={ inputClassName }/>
      { classes.warning && ( touched &&
        ( error && <span className={ classes.warning }>{ error }</span> ) ) }
    </div>
  );
};

export default FormInput;