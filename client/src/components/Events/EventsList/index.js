import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import Event from './Event';
import styles from './EventsList.module.sass'
function EventsList(props) {

    const { events, closeNotification, classContainer = '' } = props;

    const eventListStyles = cx(classContainer, styles.mainContainer)

    return (
        <div className={eventListStyles}>
            <div className={styles.headerContainer}>
                <h2>Live upcomming checks</h2>
                <div className={styles.iconWrapper}>
                    Remaining time
                    <span className="far fa-clock"></span>
                </div>
            </div>
            <Scrollbars autoHide={true} autoHeight={true} autoHeightMax={450}>
                <ul className={styles.listContainer}>
                    {events.map(event => <Event key={event.id} event={event} closeNotification={closeNotification}/>)}
                </ul>            
            </Scrollbars>

        </div>
    )
}

EventsList.propTypes = {
    events: PropTypes.array.isRequired,
    classContainer: PropTypes.string,
    closeNotification: PropTypes.func.isRequired
}

export default EventsList

