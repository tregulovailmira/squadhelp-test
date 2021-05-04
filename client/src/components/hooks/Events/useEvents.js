import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatISO, intervalToDuration, isBefore } from 'date-fns';

export default function useEvents () {
  const [events, setEvents] = useState([]);
  const [firstCalculate, setFirstCalculate] = useState(false);
  const { data: { id: userId } } = useSelector(state => state.userStore);

  useEffect(() => {
    getCurrentUserEvents();
  }, []);

  useEffect(() => {
    let timerId;
    if (events.length) {
      timerId = setTimeout(() => {
        calculateProgress();
      }, 1000);
      if (!firstCalculate) {
        calculateProgress();
        setFirstCalculate(true);
      }
      if (events.every(isFinshedAllEvents)) {
        clearTimeout(timerId);
      }
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [events]);

  const isFinshedAllEvents = (event) => {
    return event.isFinished;
  };

  const calculateProgress = () => {
    let needSort = false;
    let needUpdateLocalStorage = false;
    const newEvents = events.map((event) => {
      if (event.isFinished) {
        return event;
      }
      const { createdAt, eventDate } = event;
      const totalInterval = Date.parse(eventDate) - Date.parse(createdAt);
      const currentProgress = Date.parse(new Date()) - Date.parse(createdAt);
      const percentProgress = (currentProgress / totalInterval) * 100;
      const timeToStart = intervalToDuration({
        start: new Date(),
        end: new Date(eventDate)
      });

      const isFinished = percentProgress >= 100;
      const isRemindTime = isBefore(new Date(event.reminderDate), new Date());

      if (isFinished) {
        needSort = true;
      }

      if ((!event.isRemindTime && isRemindTime) || isFinished) {
        needUpdateLocalStorage = true;
      }
      return {
        ...event,
        percentProgress: percentProgress >= 100 ? 100 : percentProgress,
        timeToStart: percentProgress >= 100 ? {} : timeToStart,
        isFinished,
        isRemindTime
      };
    });

    if (needSort) {
      sortEvents(newEvents);
    }

    setEvents(newEvents);

    if (needUpdateLocalStorage) {
      updateEventsAtLocalStorage(newEvents);
    }
  };

  const closeRemindingNotification = (eventId) => {
    const newEvents = events.map(event =>
      eventId === event.id
        ? { ...event, isViewed: true }
        : event
    );

    sortEvents(newEvents);

    setEvents(newEvents);

    updateEventsAtLocalStorage(newEvents);
  };

  const updateEventsAtLocalStorage = (events) => {
    const eventsForStorage = events.map(({ timeToStart, percentProgress, ...event }) => {
      return { ...event };
    });

    const usersEvents = JSON.parse(localStorage.getItem('events')) || [];

    const newUsersEvents = usersEvents.filter(userEvents => userEvents.userId !== userId);
    const newEventsOfCurrentUser = {
      userId,
      events: eventsForStorage
    };

    localStorage.setItem('events', JSON.stringify([...newUsersEvents, newEventsOfCurrentUser]));
  };

  const getCurrentUserEvents = () => {
    const eventsAtStorage = localStorage.getItem('events');
    if (eventsAtStorage) {
      const parsedEvents = JSON.parse(eventsAtStorage);
      const currentUserEvents = parsedEvents.find(events => events.userId === userId);
      if (currentUserEvents) {
        setEvents(currentUserEvents.events);
      }
    }
  };

  const addEvent = (eventBody, eventDate, reminderDate) => {
    const event = {
      id: Date.now(),
      createdAt: formatISO(new Date()),
      eventBody,
      eventDate: formatISO(eventDate),
      reminderDate: formatISO(reminderDate),
      isFinished: false,
      isRemindTime: false,
      isViewed: false
    };

    const newEvents = [...events, event];

    sortEvents(newEvents);

    setEvents(newEvents);

    const usersEvents = JSON.parse(localStorage.getItem('events'));
    if (usersEvents) {
      const currentUserEvents = usersEvents.find(userEvents => userEvents.userId === userId);

      if (currentUserEvents) {
        currentUserEvents.events.push(event);

        localStorage.setItem('events', JSON.stringify([...usersEvents]));
      } else {
        const newUserEvents = {
          userId,
          events: [event]
        };
        localStorage.setItem('events', JSON.stringify([...usersEvents, newUserEvents]));
      }
    } else {
      const newUserEvents = {
        userId,
        events: [event]
      };
      localStorage.setItem('events', JSON.stringify([newUserEvents]));
    }
  };

  const sortEvents = (events) => {
    events.sort((firstEvent, secondEvent) => {
      const firstDate = new Date(firstEvent.eventDate);
      const secondDate = new Date(secondEvent.eventDate);

      if (firstEvent.isFinished && !firstEvent.isViewed) {
        if (secondEvent.isFinished && !secondEvent.isViewed) {
          return isBefore(firstDate, secondDate) ? -1 : 1;
        } else {
          return -1;
        }
      }

      if (secondEvent.isFinished && !secondEvent.isViewed) {
        if (firstEvent.isFinished && !firstEvent.isViewed) {
          return isBefore(firstDate, secondDate) ? -1 : 1;
        } else {
          return 1;
        }
      }

      if (firstEvent.isFinished && !secondEvent.isFinished) {
        return 1;
      }
      if (secondEvent.isFinished && !firstEvent.isFinished) {
        return -1;
      }

      return isBefore(firstDate, secondDate) ? -1 : 1;
    });
  };

  return [events, addEvent, closeRemindingNotification];
}
