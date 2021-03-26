import React from 'react';
import EventsList from './EventsList';

export default function Events() {

    return (
        <div>
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
