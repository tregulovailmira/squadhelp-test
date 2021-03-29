import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatISO, intervalToDuration, parseISO } from 'date-fns';

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
                end: eventDate
            });

            const isFinished = persentProgress >= 100 ? true : false;

            return { 
                ...event, 
                persentProgress: persentProgress >= 100 ? 100 : persentProgress, 
                timeToStart: persentProgress >= 100 ? {} : timeToStart,
                isFinished
            }
        });
        setEvents(newEvents);
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

    return [events, addEvent];
}
