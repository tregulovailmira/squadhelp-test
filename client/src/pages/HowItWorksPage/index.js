import React from 'react';
import Header from '../../components/Header/Header';
import HowItWorks from '../../components/HowItWorks';
import Footer from '../../components/Footer/Footer';
import styles from './HowItWorksPage.module.sass'

function HowItWorksPage() {
    return (
        <div className={styles.pageContainer}>
            <Header classContainer={styles.headerShadow}/>
            <div className={styles.mainContent}>
                <HowItWorks/>
            </div>
            <Footer/>
        </div>
    )
}

export default HowItWorksPage;

