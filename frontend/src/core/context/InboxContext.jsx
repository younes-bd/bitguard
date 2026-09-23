import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import client, { extractData, baseURL } from '../api/client';
import { useAuth } from '../hooks/useAuth';

// Minimal inline service for mail
const inboxService = {
    getAll: () => client.get('inbox/').then(extractData),
    markRead: (id) => client.patch(`inbox/${id}/`, { is_read: true }),
    markAllRead: () => client.post('inbox/mark-all-read/'),
    delete: (id) => client.delete(`inbox/${id}/`),
};

const InboxContext = createContext();

export const InboxProvider = ({ children }) => {
    const [mailMessages, setmailMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { isAuthenticated } = useAuth();
    const wsRef = useRef(null);
    const pollingIntervalRef = useRef(null);

    const loadmailMessages = useCallback(async () => {
        try {
            const data = await inboxService.getAll();
            const mailMessagesArray = Array.isArray(data) ? data : [];
            setmailMessages(mailMessagesArray);
            setUnreadCount(mailMessagesArray.filter(n => !n.is_read).length);
        } catch (error) {
            console.error("Failed to load mailMessages", error);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            setmailMessages([]);
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
        loadmailMessages();

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
                        setmailMessages(prev => [newNotif, ...prev]);
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
                        pollingIntervalRef.current = setInterval(loadmailMessages, 30000);
                    }
                };

                wsRef.current = ws;
            } catch (e) {
                console.warn('Failed to setup WebSocket, falling back to polling', e);
                pollingIntervalRef.current = setInterval(loadmailMessages, 30000);
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
    }, [isAuthenticated, loadmailMessages]);

    const addInbox = (type, message) => {
        // Local only for immediate feedback
        const id = `local_${Date.now()}`;
        setmailMessages(prev => [{ id, type, message, is_read: false, created_at: new Date().toISOString() }, ...prev]);
        setUnreadCount(prev => prev + 1);
    };

    const removeInbox = async (id) => {
        try {
            // Optimistic update
            const notifToRemove = mailMessages.find(n => n.id === id);
            setmailMessages(prev => prev.filter(n => n.id !== id));
            if (notifToRemove && !notifToRemove.is_read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }

            if (!String(id).startsWith('local_')) {
                await inboxService.delete(id);
            }
        } catch (e) {
            loadmailMessages(); // Revert on error
        }
    };

    const markRead = async (id) => {
        try {
            setmailMessages(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
            
            if (!String(id).startsWith('local_')) {
                await inboxService.markRead(id);
            }
        } catch (e) {
            console.error(e);
            loadmailMessages();
        }
    };

    const markAllRead = async () => {
        try {
            setmailMessages(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
            await inboxService.markAllRead();
        } catch (e) {
            console.error(e);
            loadmailMessages();
        }
    };

    return (
        <InboxContext.Provider value={{ mailMessages, unreadCount, addInbox, removeInbox, markRead, markAllRead }}>
            {children}
        </InboxContext.Provider>
    );
};

export const useInbox = () => useContext(InboxContext);




