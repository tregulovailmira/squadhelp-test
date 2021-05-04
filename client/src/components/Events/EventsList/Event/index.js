import React from 'react';
import PropTypes from 'prop-types';
import styles from './Event.module.sass';

function Event (props) {
  const { event: { eventBody, percentProgress, timeToStart = {}, isFinished } } = props;
  const { years, months, weeks, days, hours, minutes, seconds } = timeToStart;

  const linearProgress = isFinished ? 100 : percentProgress;

  return (
        <li className={styles.eventContainer} style={{ background: `linear-gradient(0.25turn, #d1e9cf ${linearProgress}%, #eeeeee 0% )` }}>
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
  );
}

Event.propTypes = {
  event: PropTypes.shape({
    eventBody: PropTypes.string.isRequired,
    percentProgress: PropTypes.number,
    timeToStart: PropTypes.objectOf(PropTypes.number),
    isFinished: PropTypes.bool.isRequired
  })
};

export default Event;
