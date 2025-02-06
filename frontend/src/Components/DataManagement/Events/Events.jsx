import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Events.css'; // Import the CSS file

const Events = () => {
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // Fetch events from the backend
    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:3001/Events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error.message);
        }
    };

    // Add an event
    const addEvent = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/Events', { title, content });
            setTitle('');
            setContent('');
            fetchEvents(); // Refresh the event list
        } catch (error) {
            console.error('Error adding event:', error.message);
        }
    };

    // Calculate remaining time for each event
    const calculateRemainingTime = (createdAt) => {
        const eventTime = new Date(createdAt).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = eventTime + 24 * 60 * 60 * 1000 - currentTime; // 24 hours in milliseconds
        return Math.max(0, timeDifference); // Ensure it doesn't go negative
    };

    // Format remaining time as HH:MM:SS
    const formatTime = (time) => {
        const hours = Math.floor(time / (1000 * 60 * 60));
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Update timers every second
    useEffect(() => {
        const interval = setInterval(() => {
            setEvents((prevEvents) =>
                prevEvents.map((event) => ({
                    ...event,
                    remainingTime: calculateRemainingTime(event.createdAt),
                }))
            );
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    // Load events on component mount
    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="event-container">
            <div className="event-form">
                <h1>Add Event</h1>
                <form onSubmit={addEvent}>
                    <div>
                        <label className='event-label'>Title:</label>
                        <input className='event-input'
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className='event-label'>Content:</label>
                        <textarea className='event-textarea'
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <button className='event-button' type="submit">Add Event</button>
                </form>
            </div>

            <div className="events-list">
                <h1>Events</h1>
                {events.length === 0 ? (
                    <p className="no-events">No events available.</p>
                ) : (
                    events.map((event) => (
                        <div key={event._id} className="event-card">
                            <h3>{event.title}</h3>
                            <p>{event.content}</p>
                            <small>
                                {formatTime(event.remainingTime)} remaining
                            </small>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Events;