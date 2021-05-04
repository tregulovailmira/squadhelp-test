import React from 'react';
import Header from '../../components/Header/Header';
import HowItWorks from '../../components/HowItWorks';
import ContactUs from '../../components/HowItWorks/ContactUs';
import Footer from '../../components/Footer/Footer';
import styles from './HowItWorksPage.module.sass'

function HowItWorksPage() {
    return (
        <div className={styles.pageContainer}>
            <Header classContainer={styles.headerShadow}/>
            <div className={styles.mainContent}>
                <HowItWorks/>
            </div>
            <div>
                <ContactUs/>
                <Footer/>
            </div>
        </div>
    )
}

export default HowItWorksPage;

