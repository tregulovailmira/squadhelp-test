import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './Button.module.sass';

function Button(props) {
    const { value, handleClick, iconText, children: description, checkedValue } = props;

    const onClickHandle = () => {
        handleClick(value);
    }

    const buttonStyles = cx(styles.buttonContainer, {
        [styles.checkedButton]: checkedValue === value
    });

    const iconStyles = cx(styles.buttonIcon, {
        [styles.checkedIcon]: checkedValue === value
    })

    return (
        <div className={buttonStyles} onClick={onClickHandle}>
            <div className={iconStyles}>{iconText}</div>
            <div className={styles.description}>{description}</div>
        </div>
    )
}

Button.propTypes = {
    value: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
    iconText: PropTypes.string.isRequired,
}

export default Button

