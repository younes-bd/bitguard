import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageMeta — Sets document <title> and meta description for SEO.
 * Also scrolls to top on route change.
 */
const PageMeta = ({ title, description }) => {
    const location = useLocation();

    useEffect(() => {
        // Set page title
        document.title = title ? `${title} | BitGuard` : 'BitGuard — Enterprise Managed IT & Cybersecurity';

        // Set meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', description || 'BitGuard provides enterprise-grade managed IT services, cybersecurity solutions, and cloud infrastructure for businesses of all sizes.');
        } else if (description) {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = description;
            document.head.appendChild(meta);
        }
    }, [title, description]);

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);

    return null;
};

export default PageMeta;
