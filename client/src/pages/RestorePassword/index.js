import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import history from '../../browserHistory';
import RestorePasswordForm from '../../components/RestorePasswordForm';
import RestorePasswordInfo from '../../components/RestorePasswordInfo';
import Logo from '../../components/Logo';
import CONSTANTS from '../../constants';
import styles from './RestorePassword.module.sass';

const RestorePassword = () => {

    const [tokenData, setTokenData] = useState('');
    
    useEffect(() => {
        const { token } = queryString.parse(window.location.search);
        setTokenData(token);
        history.replace('/restorePassword')
    }, [])

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
                {tokenData ? <RestorePasswordInfo/> : <RestorePasswordForm />}
            </div>
            
        </div>
    )
}

export default RestorePassword;
