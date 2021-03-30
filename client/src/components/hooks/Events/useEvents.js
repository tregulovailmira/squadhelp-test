import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatISO, intervalToDuration, isBefore } from 'date-fns';

export default function useEvents() {

    const [events, setEvents] = useState([]);
    const { data: { id: userId }} = useSelector(state => state.userStore);
    
    useEffect(() => {
        getCurrentUserEvents();
    }, []);

    useEffect(() => {

        const timerId = setTimeout(() => {
            calculateProgress();
        }, 1000);

        if(events.every(isFinshedAllEvents)){
            clearTimeout(timerId);
        };

        return () => {
            clearTimeout(timerId);
        }

    }, [events]);

    const isFinshedAllEvents = (event) => {
        return event.isFinished;
    }

    const calculateProgress = () => {
        const newEvents = events.map((event) => {
            const { createdAt, eventDate } = event;
            const totalInterval = Date.parse(eventDate) - Date.parse(createdAt);
            const currentProgress = Date.parse(new Date()) - Date.parse(createdAt);
            const persentProgress = (currentProgress / totalInterval) * 100;
            const timeToStart = intervalToDuration({
                start: new Date(), 
                end: new Date(eventDate)
            });

            const isFinished = persentProgress >= 100 ? true : false;
            const isRemindTime = isBefore(new Date(event.reminderDate), new Date());
            return { 
                ...event, 
                persentProgress: persentProgress >= 100 ? 100 : persentProgress, 
                timeToStart: persentProgress >= 100 ? {} : timeToStart,
                isFinished,
                isRemindTime,                
            }
        });
        setEvents(newEvents);
        updateEventsAtLocalStorage(newEvents);
    };

    const closeRemindingNotification = (eventId) => {

        const newEvents = events.map(event => 
            eventId === event.id
                ? { ...event, isViewed: true }
                : event
        );
        setEvents(newEvents);

        updateEventsAtLocalStorage(newEvents);

    };

    const updateEventsAtLocalStorage = (events) => {

        const eventsForStorage = events.map(({timeToStart, persentProgress, ...event}) => {
            return { ...event}
        });

        const usersEvents = JSON.parse(localStorage.getItem('events'));

        const newUsersEvents = usersEvents.filter(userEvents => userEvents.userId !== userId);
        const newEventsOfCurrentUser = {
            userId,
            events: eventsForStorage
        };

        localStorage.setItem('events', JSON.stringify([...newUsersEvents, newEventsOfCurrentUser]));
        
    }

    const getCurrentUserEvents = () => {
        const eventsAtStorage = localStorage.getItem('events');
        if(eventsAtStorage) {
            const parsedEvents = JSON.parse(eventsAtStorage);
            const currentUserEvents = parsedEvents.find(events => events.userId === userId);
            if(currentUserEvents) {
                setEvents(currentUserEvents.events);
            }
        }
    }

    const addEvent = (eventBody, eventDate, reminderDate, userId) => {
        const event = {
            id: Date.now(),
            createdAt: formatISO(new Date()),
            eventBody,
            eventDate,
            reminderDate
        };

        setEvents([...events, event]);
        
        const usersEvents = JSON.parse(localStorage.getItem('events'));
        if(usersEvents) {
            const currentUserEvents = usersEvents.find(userEvents => userEvents.userId === userId);

            if(currentUserEvents) {

                currentUserEvents.events.push(event);

                localStorage.setItem('events', JSON.stringify([...usersEvents]));
            } else {

                const newUserEvents = {
                    userId,
                    events: [event]
                };
                localStorage.setItem('events', JSON.stringify([...usersEvents, newUserEvents]));
            };    

        } else {
            const newUserEvents = {
                userId,
                events: [event]
            };
            localStorage.setItem('events', JSON.stringify([newUserEvents]));
        };
    }

    return [events, addEvent, closeRemindingNotification];
}
