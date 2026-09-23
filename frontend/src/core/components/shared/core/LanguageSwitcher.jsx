import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { settingsService } from '../../../../apps/system/api/settingsService';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [languages, setLanguages] = useState([]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Fetch active languages from Django
        settingsService.getLanguages().then(res => {
            const data = res.data?.results || res.data || [];
            if (data.length > 0) {
                setLanguages(data.filter(l => l.is_active));
            } else {
                // Fallback for missing backend data
                setLanguages([{ code: 'en', name: 'English' }, { code: 'fr', name: 'French' }]);
            }
        }).catch(() => {
            setLanguages([{ code: 'en', name: 'English' }, { code: 'fr', name: 'French' }]);
        });
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLanguage = (code) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    if (languages.length < 2) return null; // No need for switcher if only 1 language

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
                title="Change Language"
            >
                <Globe className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 overflow-hidden">
                    {languages.map((lang) => (
                        <button
                            key={lang.code || lang.id}
                            onClick={() => changeLanguage(lang.code)}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${i18n.language === lang.code ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-slate-800'}`}
                        >
                            <span>{lang.name}</span>
                            <span className="text-xs text-slate-500 uppercase">{lang.code}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
