import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './Event.module.sass';

function Event(props) {
    const { event: { id, eventBody, percentProgress = 0, timeToStart = {}, isRemindTime, isViewed }, closeNotification } = props;
    const { years, months, weeks, days, hours, minutes, seconds } = timeToStart;
    
    const handleClose = (e) => {
        e.stopPropagation();
        closeNotification(id);
    };

    const closeRemindingClasses = cx("fas fa-times", styles.closeButton);

    return (
        <li className={styles.eventContainer} style={{background: `linear-gradient(0.25turn, #d1e9cf ${percentProgress}%, #eeeeee 0% )`}}>
            { 
                isRemindTime && !isViewed &&
                <div className={styles.eventReminding}>
                   <span>Starting soon</span>
                   <span onClick={handleClose} className={closeRemindingClasses}></span>
                </div> 
            }
            <div>
                {eventBody}
            </div>
            <div className={styles.timer}>
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

