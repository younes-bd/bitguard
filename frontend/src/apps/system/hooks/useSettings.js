import { useState, useEffect } from 'react';
import client from '@/core/api/client';
import toast from 'react-hot-toast';

export function useSettings(prefix = '') {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await client.get('system/settings/');
                const data = res.data?.results || res.data || [];
                const newSettings = {};
                data.forEach(s => {
                    newSettings[s.key] = s.value;
                });
                setSettings(newSettings);
            } catch (err) {
                console.error("Failed to load settings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const updateSetting = async (key, value) => {
        const originalValue = settings[key];
        const strValue = String(value);
        
        // Optimistic update
        setSettings(prev => ({ ...prev, [key]: strValue }));
        
        try {
            await client.post('system/settings/batch_update/', {
                settings: { [key]: strValue }
            });
            toast.success('Setting updated');
        } catch (err) {
            console.error("Failed to update setting:", err);
            toast.error('Failed to update setting');
            // Revert
            setSettings(prev => ({ ...prev, [key]: originalValue }));
        }
    };

    return { settings, updateSetting, loading };
}
