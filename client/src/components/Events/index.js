import React, { useState } from 'react';
import EventsList from './EventsList';
import AddEventForm from './AddEventForm';

export default function Events() {

    const [isShownAddEventForm, setIsShownAddEventForm] = useState(false);

    const openAddEventForm = () => {
        setIsShownAddEventForm(true);
    }

    const closeAddEventForm = () => {
        setIsShownAddEventForm(false);
    }

    return (
        <div>
            <button onClick={openAddEventForm}>New event</button>
            <AddEventForm isShown={isShownAddEventForm} closeForm={closeAddEventForm} onSubmit={()=>{}}/>
            <EventsList events={events}/>
        </div>
    )
}

const events = [{
    id: 1,
    eventBody: 'test', 
    eventDate: '22-11-2021 19:30',
    reminderDate: '22-11-2021 18:30'
}];
