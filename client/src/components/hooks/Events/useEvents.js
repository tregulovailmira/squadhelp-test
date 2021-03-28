import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatISO } from 'date-fns';

export default function useEvents() {

    const [events, setEvents] = useState([]);
    const { data: { id: userId }} = useSelector(state => state.userStore);
    
    useEffect(() => {
        getCurrentUserEvents();
    }, []);

    const getCurrentUserEvents = () => {
        const eventsAtStorage = localStorage.getItem('events');
        if(eventsAtStorage) {
            const parsedEvents = JSON.parse(localStorage.getItem('events'));
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
