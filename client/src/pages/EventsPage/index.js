import React from 'react';
import Header from '../../components/Header/Header';
import Events from '../../components/Events';
import Footer from '../../components/Footer/Footer';
import styles from './EventsPage.module.sass';

export default function EventsPage () {
  return (
        <div className={styles.pageContainer}>
            <Header/>
            <Events classContainer={styles.eventsPosition}/>
            <Footer/>
        </div>
  );
}
