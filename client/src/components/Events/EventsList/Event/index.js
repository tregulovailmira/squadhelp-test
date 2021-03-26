import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Event(props) {
    const { event: { id, eventBody, eventDate,  } } = props;

    return (
        <li>
            <div>
                {eventBody}
            </div>
        </li>
    )
}

Event.propTypes = {
    event: PropTypes.shape({
        id: PropTypes.number.isRequired,
        eventBody: PropTypes.string.isRequired,
        eventDate: PropTypes.string.isRequired,
        reminderDate: PropTypes.string.isRequired,
    })
}

export default Event

