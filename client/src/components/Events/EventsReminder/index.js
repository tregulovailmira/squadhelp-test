import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from './EventsReminder.module.sass';

function EventReminder (props) {
  const { events, closeNotification } = props;

  const countEventsForRemind = events.reduce((accumulator, event) => {
    if (event.isRemindTime && !event.isViewed) {
      return accumulator + 1;
    }
    return accumulator;
  }, 0);

  const closeRemindingClasses = cx('fas fa-times', styles.closeButton);

  const handleClose = (e) => {
    e.stopPropagation();
    closeNotification();
  };

  return (
    <>{ countEventsForRemind > 0 &&
        <div className={styles.eventReminding}>
            <span>{countEventsForRemind} event(s) start soon</span>
            <span onClick={handleClose} className={closeRemindingClasses}></span>
        </div>
    }</>
  );
}

EventReminder.propTypes = {
  events: PropTypes.array.isRequired,
  closeNotification: PropTypes.func.isRequired
};

export default EventReminder;
