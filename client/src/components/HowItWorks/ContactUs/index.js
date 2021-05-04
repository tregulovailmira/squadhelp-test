import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import CONSTANTS from '../../../constants';
import Button from '../Button';
import styles from './ContactUs.module.sass';

function ContactUs (props) {
  const iconStyles = cx('far fa-envelope', styles.icon);
  return (
        <div className={styles.contactUsContainer}>
            <span className={iconStyles}></span>
            <div className={styles.textContainer}>
                <h3 className={styles.header}>Questions?</h3>
                <p className={styles.description}>Check out our <Link to='/'>FAQs</Link> or send us a <Link to='/'>message</Link>. For assistance with launching a contest, you can also call us at {CONSTANTS.SQUADHELP_PHONE} or schedule a <Link to='/'>Branding Consultation</Link></p>
            </div>
            <Button to='/' text='get in touch' classContainer={styles.buttonPosition}/>
        </div>

  );
}

ContactUs.propTypes = {
  classContainer: PropTypes.string
};

export default ContactUs;
