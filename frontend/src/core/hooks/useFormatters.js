import { useCallback } from 'react';
import { useConfig } from '../context/ConfigContext';

export function useFormatters() {
    const { config } = useConfig();

    const formatDate = useCallback((dateString, options = {}) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date)) return dateString;

        return new Intl.DateTimeFormat(config.language, {
            timeZone: config.timezone,
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            ...options
        }).format(date);
    }, [config.language, config.timezone]);

    const formatDateTime = useCallback((dateString, options = {}) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date)) return dateString;

        return new Intl.DateTimeFormat(config.language, {
            timeZone: config.timezone,
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            ...options
        }).format(date);
    }, [config.language, config.timezone]);

    const formatCurrency = useCallback((amount, options = {}) => {
        if (amount === null || amount === undefined) return '';
        const num = Number(amount);
        if (isNaN(num)) return amount;

        // Fallback to USD if company default_currency is not set
        const currencyCode = config.currency?.code || config.currency || 'USD';

        return new Intl.NumberFormat(config.language, {
            style: 'currency',
            currency: currencyCode,
            ...options
        }).format(num);
    }, [config.language, config.currency]);

    const formatNumber = useCallback((number, options = {}) => {
        if (number === null || number === undefined) return '';
        const num = Number(number);
        if (isNaN(num)) return number;

        return new Intl.NumberFormat(config.language, {
            maximumFractionDigits: 2,
            ...options
        }).format(num);
    }, [config.language]);

    return {
        formatDate,
        formatDateTime,
        formatCurrency,
        formatNumber
    };
}
