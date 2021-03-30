import React from 'react';
import PropTypes from 'prop-types';
import Event from './Event';

function EventsList(props) {

    const { events, closeNotification } = props;
    
    return (
        <ul>
            {events.map(event => <Event key={event.id} event={event} closeNotification={closeNotification}/>)}
        </ul>
    )
}

EventsList.propTypes = {

}

export default EventsList

