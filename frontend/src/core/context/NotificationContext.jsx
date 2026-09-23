import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import client, { extractData, baseURL } from '../api/client';
import { useAuth } from '../hooks/useAuth';

// Minimal inline service for inbox
const inboxService = {
    getAll: () => client.get('inbox/').then(extractData),
    markRead: (id) => client.patch(`inbox/${id}/`, { is_read: true }),
    markAllRead: () => client.post('inbox/mark-all-read/'),
    delete: (id) => client.delete(`inbox/${id}/`),
};

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [inbox, setInbox] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { isAuthenticated } = useAuth();
    const wsRef = useRef(null);
    const pollingIntervalRef = useRef(null);

    const loadInbox = useCallback(async () => {
        try {
            const data = await inboxService.getAll();
            const inboxArray = Array.isArray(data) ? data : [];
            setInbox(inboxArray);
            setUnreadCount(inboxArray.filter(n => !n.is_read).length);
        } catch (error) {
            console.error("Failed to load inbox", error);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            setInbox([]);
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
        loadInbox();

        // 2. Try WebSocket
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const wsUrl = new URL(baseURL);
                const wsProtocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
                const wsHost = wsUrl.host;
                const wsEndpoint = `${wsProtocol}//${wsHost}/ws/inbox/?token=${token}`;
                
                const ws = new WebSocket(wsEndpoint);
                
                ws.onmessage = (event) => {
                    try {
                        const newNotif = JSON.parse(event.data);
                        setInbox(prev => [newNotif, ...prev]);
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
                        pollingIntervalRef.current = setInterval(loadInbox, 30000);
                    }
                };

                wsRef.current = ws;
            } catch (e) {
                console.warn('Failed to setup WebSocket, falling back to polling', e);
                pollingIntervalRef.current = setInterval(loadInbox, 30000);
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
    }, [isAuthenticated, loadInbox]);

    const addNotification = (type, message) => {
        // Local only for immediate feedback
        const id = `local_${Date.now()}`;
        setInbox(prev => [{ id, type, message, is_read: false, created_at: new Date().toISOString() }, ...prev]);
        setUnreadCount(prev => prev + 1);
    };

    const removeNotification = async (id) => {
        try {
            // Optimistic update
            const notifToRemove = inbox.find(n => n.id === id);
            setInbox(prev => prev.filter(n => n.id !== id));
            if (notifToRemove && !notifToRemove.is_read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }

            if (!String(id).startsWith('local_')) {
                await inboxService.delete(id);
            }
        } catch (e) {
            loadInbox(); // Revert on error
        }
    };

    const markRead = async (id) => {
        try {
            setInbox(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
            
            if (!String(id).startsWith('local_')) {
                await inboxService.markRead(id);
            }
        } catch (e) {
            console.error(e);
            loadInbox();
        }
    };

    const markAllRead = async () => {
        try {
            setInbox(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
            await inboxService.markAllRead();
        } catch (e) {
            console.error(e);
            loadInbox();
        }
    };

    return (
        <NotificationContext.Provider value={{ inbox, unreadCount, addNotification, removeNotification, markRead, markAllRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
