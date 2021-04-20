import React from 'react';
import RestorePasswordForm from '../../components/RestorePasswordForm';
import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';
import CONSTANTS from '../../constants';
import styles from './RestorePassword.module.sass';

const RestorePassword = () => {
    return (
        <div className={ styles.mainContainer }>
            <div className={styles.headerContainer}>
                <Logo src={ `${CONSTANTS.STATIC_IMAGES_PATH}logo.png` } alt="logo"/>
                <div className={styles.buttonsContainer}>
                    <Link to='/login' className={styles.authButton}>
                        Login
                    </Link>
                    <Link to='/registration' className={styles.authButton}>
                        Signup
                    </Link>
                </div>
            </div>
            <div className={styles.formContainer}>
                <h2>RESTORE YOUR PASSWORD</h2>
                <RestorePasswordForm />
            </div>
            
        </div>
    )
}

export default RestorePassword;
