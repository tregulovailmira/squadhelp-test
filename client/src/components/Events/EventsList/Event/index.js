import React from 'react';
import PropTypes from 'prop-types';

function Event(props) {
    const { event: { id, eventBody, eventDate, timeToStart = {}, isRemindTime, isViewed }, closeNotification } = props;
    const { years, months, weeks, days, hours, minutes, seconds } = timeToStart;

    const handleClose = (e) => {
        e.stopPropagation();
        closeNotification(id);
    }
    return (
        <li>
            { 
                isRemindTime && !isViewed &&
                <div>
                   <span>Soon the beginning of the event</span>
                   <button onClick={handleClose}>Close reminding</button>
                </div> 
            }
            <div>
                {eventBody}
            </div>
            <div>
                {years > 0 && <span>{years}y&nbsp;</span>}
                {months > 0 && <span>{months}m&nbsp;</span>}
                {weeks > 0 && <span>{weeks}w&nbsp;</span>}
                {days > 0 && <span>{days}d&nbsp;</span>}
                {hours > 0 && <span>{hours}h&nbsp;</span>}
                {minutes > 0 && <span>{minutes}m&nbsp;</span>}
                {seconds > 0 && <span>{seconds}s&nbsp;</span>}
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

