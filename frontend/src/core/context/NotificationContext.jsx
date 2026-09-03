import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import client, { extractData, baseURL } from '../api/client';
import { useAuth } from '../hooks/useAuth';

// Minimal inline service for notifications
const notificationsService = {
    getAll: () => client.get('notifications/').then(extractData),
    markRead: (id) => client.patch(`notifications/${id}/`, { is_read: true }),
    markAllRead: () => client.post('notifications/mark-all-read/'),
    delete: (id) => client.delete(`notifications/${id}/`),
};

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { isAuthenticated } = useAuth();
    const wsRef = useRef(null);
    const pollingIntervalRef = useRef(null);

    const loadNotifications = useCallback(async () => {
        try {
            const data = await notificationsService.getAll();
            const notificationsArray = Array.isArray(data) ? data : [];
            setNotifications(notificationsArray);
            setUnreadCount(notificationsArray.filter(n => !n.is_read).length);
        } catch (error) {
            console.error("Failed to load notifications", error);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            setNotifications([]);
            setUnreadCount(0);
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
            return;
        }

        // 1. Initial Load
        loadNotifications();

        // 2. Try WebSocket
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const wsUrl = new URL(baseURL);
                const wsProtocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
                const wsHost = wsUrl.host;
                const wsEndpoint = `${wsProtocol}//${wsHost}/ws/notifications/?token=${token}`;
                
                const ws = new WebSocket(wsEndpoint);
                
                ws.onmessage = (event) => {
                    try {
                        const newNotif = JSON.parse(event.data);
                        setNotifications(prev => [newNotif, ...prev]);
                        setUnreadCount(prev => prev + 1);
                    } catch (e) {
                        console.error('WS message error', e);
                    }
                };

                ws.onerror = () => {
                    console.warn('WebSocket failed, falling back to polling');
                };

                ws.onclose = () => {
                    // Fallback to polling if WS closes or fails
                    if (!pollingIntervalRef.current) {
                        pollingIntervalRef.current = setInterval(loadNotifications, 30000);
                    }
                };

                wsRef.current = ws;
            } catch (e) {
                console.warn('Failed to setup WebSocket, falling back to polling', e);
                pollingIntervalRef.current = setInterval(loadNotifications, 30000);
            }
        } // No token branch removed, as we shouldn't poll if we don't have a token.

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        };
    }, [isAuthenticated, loadNotifications]);

    const addNotification = (type, message) => {
        // Local only for immediate feedback
        const id = `local_${Date.now()}`;
        setNotifications(prev => [{ id, type, message, is_read: false, created_at: new Date().toISOString() }, ...prev]);
        setUnreadCount(prev => prev + 1);
    };

    const removeNotification = async (id) => {
        try {
            // Optimistic update
            const notifToRemove = notifications.find(n => n.id === id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (notifToRemove && !notifToRemove.is_read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }

            if (!String(id).startsWith('local_')) {
                await notificationsService.delete(id);
            }
        } catch (e) {
            loadNotifications(); // Revert on error
        }
    };

    const markRead = async (id) => {
        try {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
            
            if (!String(id).startsWith('local_')) {
                await notificationsService.markRead(id);
            }
        } catch (e) {
            console.error(e);
            loadNotifications();
        }
    };

    const markAllRead = async () => {
        try {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
            await notificationsService.markAllRead();
        } catch (e) {
            console.error(e);
            loadNotifications();
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, removeNotification, markRead, markAllRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
