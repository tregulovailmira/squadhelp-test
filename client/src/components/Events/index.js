import React, { useState } from 'react';
import cx from 'classnames';
import { Button } from 'react-bootstrap';
import useEvents from '../hooks/Events/useEvents';
import EventsList from './EventsList';
import AddEventForm from './AddEventForm';
import styles from './Events.module.sass'

export default function Events(props) {

    const { classContainer } = props;

    const [events, addEvent, closeRemindingNotification] = useEvents();

    const [isShownAddEventForm, setIsShownAddEventForm] = useState(false);

    const openAddEventForm = () => {
        setIsShownAddEventForm(true);
    }

    const closeAddEventForm = () => {
        setIsShownAddEventForm(false);
    }

    const eventsClasses = cx(classContainer, styles.mainContainer);
    return (
        <div className={eventsClasses}>
            <Button variant='primary' onClick={openAddEventForm} className={styles.addEventButton} title="New event">
                <span className="fas fa-plus"></span>
            </Button>
            <AddEventForm show={isShownAddEventForm} onHide={closeAddEventForm} onSubmit={addEvent}/>
            <EventsList events={events} closeNotification={closeRemindingNotification} classContainer={styles.listPosition}/>
        </div>
    )
}

const events = [{
    id: 1,
    eventBody: 'test', 
    eventDate: '22-11-2021 19:30',
    reminderDate: '22-11-2021 18:30'
}];
