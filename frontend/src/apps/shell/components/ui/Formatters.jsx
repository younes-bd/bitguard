import React from 'react';
import { useFormatters } from '@/core/hooks/useFormatters';

export function FormattedDate({ value, options, className = '' }) {
    const { formatDate } = useFormatters();
    if (!value) return <span className={className}>-</span>;
    return <span className={className}>{formatDate(value, options)}</span>;
}

export function FormattedDateTime({ value, options, className = '' }) {
    const { formatDateTime } = useFormatters();
    if (!value) return <span className={className}>-</span>;
    return <span className={className}>{formatDateTime(value, options)}</span>;
}

export function FormattedCurrency({ value, options, className = '' }) {
    const { formatCurrency } = useFormatters();
    if (value === null || value === undefined) return <span className={className}>-</span>;
    return <span className={className}>{formatCurrency(value, options)}</span>;
}

export function FormattedNumber({ value, options, className = '' }) {
    const { formatNumber } = useFormatters();
    if (value === null || value === undefined) return <span className={className}>-</span>;
    return <span className={className}>{formatNumber(value, options)}</span>;
}
