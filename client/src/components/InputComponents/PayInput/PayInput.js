import React from 'react';
import classNames from 'classnames';
import InputMask from 'react-input-mask';


const PayInput = (props) => {
    const {label, input: {name}, input, changeFocus, type, classes, meta: {touched, error}, isInputMask, mask} = props;
    if (name === 'sum') {
        return (
            <div className={classes.container}>
                <input {...input} placeholder={label} type={type}
                       className={classNames(classes.input, {[classes.notValid]: touched && error})}/>
                {(touched && error) && <span className={classes.error}>{error}!</span>}
            </div>
        )
    } else if (isInputMask) {
        return (
            <div className={classes.container}>
                <InputMask mask={mask} maskChar={null} {...input} placeholder={label} type={type}
                           className={classNames(classes.input, {[classes.notValid]: touched && error})}
                           onFocus={() => changeFocus(name)}/>
                {(touched && error) && <span className={classes.error}>{error}!</span>}
            </div>
        )
    } else {
        return (
            <div className={classes.container}>
                <input {...input} placeholder={label} type={type}
                       className={classNames(classes.input, {[classes.notValid]: touched && error})}
                       onFocus={() => changeFocus(name)}/>
                {(touched && error) && <span className={classes.error}>{error}!</span>}
            </div>
        )
    }
};

export default PayInput;