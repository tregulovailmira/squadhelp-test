import React from 'react';
import { Link } from 'react-router-dom';
import CONSTANTS from '../../../constants';
import Button from '../Button';
import styles from './ContactUs.module.sass';

export default function ContactUs() {
    return (
        <div className={styles.contactUsContainer}>
            <span className="far fa-envelope"></span>
            <div className={styles.textContainer}>
                <h3>Questions?</h3>
                <p>Check out our <Link to='/'>FAQs</Link>FAQs or send us a <Link to='/'>message</Link>. For assistance with launching a contest, you can also call us at {CONSTANTS.SQUADHELP_PHONE} or schedule a <Link to='/'>Branding Consultation</Link></p>
            </div>
            <Button to='/' text='get in touch' classContainer={styles.buttonPosition}/>
        </div>

    )
}
