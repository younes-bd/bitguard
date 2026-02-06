import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

import { notificationService } from '../services/notificationService';

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Initial Load + Polling (Basic implementation, WebSocket would be better for standard)
    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await notificationService.getAll();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        } catch (error) {
            console.error("Failed to load notifications", error);
        }
    };

    const addNotification = (type, message) => {
        // Local only for immediate feedback (toasts), or post to backend if needed
        const id = Date.now();
        setNotifications(prev => [{ id, type, message, is_read: false, created_at: new Date() }, ...prev]);
    };

    const removeNotification = async (id) => {
        try {
            // Optimistic update
            setNotifications(prev => prev.filter(n => n.id !== id));
            // call backend to delete or mark read
            await notificationService.delete(id);
        } catch (e) {
            loadNotifications(); // Revert on error
        }
    };

    const markAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            loadNotifications();
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, removeNotification, markAllRead }}>
            {children}
            {/* Toast Container could go here */}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
