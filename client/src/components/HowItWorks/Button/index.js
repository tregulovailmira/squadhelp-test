import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import styles from './Button.module.sass';

function Button(props) {
    const { to, text, classContainer } = props;
    const buttonClasses = cx(classContainer, styles.button);

    return (
        <Link to={to} className={buttonClasses}>
            <span className={styles.buttonText}>{text}</span>
        </Link>
    )
}

Button.propTypes = {
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    classContainer: PropTypes.string
}

export default Button

