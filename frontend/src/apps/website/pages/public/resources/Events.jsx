import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionDivider from '../../../../../core/components/SectionDivider';
import PageMeta from '../../../../../core/components/shared/PageMeta';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        import('../../../../../core/api/erpService').then(module => {
            module.erpService.getEvents().then(data => {
                setEvents(data || []);
                setLoading(false);
            }).catch(() => setLoading(false));
        });
    }, []);

    const upcomingEvents = events.filter(e => e.status !== 'completed' && e.status !== 'archived').slice(0, 3) || [];
    const pastEvents = events.filter(e => e.status === 'completed' || e.status === 'archived').slice(0, 5) || [];

    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen transition-colors duration-300">
            <PageMeta title="Events & Webinars" description="Attend BitGuard webinars, conferences, and panel discussions on cybersecurity and IT best practices." />
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 dark:bg-slate-950 bg-slate-950 overflow-hidden transition-colors duration-300">
                <div className="absolute inset-0 bg-blue-600/10 blur-[100px] pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Live Sessions & Webinars
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Events & Webinars
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                        Connect with experts, learn industry best practices, and stay ahead of the curve.
                    </p>
                </div>
            </section>
            
            <SectionDivider variant="wave" from="dark" to="light" />

            {/* Upcoming Events Grid */}
            <section className="py-20 dark:bg-slate-900 bg-slate-50 transition-colors duration-300">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold dark:text-white text-slate-900 mb-10 flex items-center gap-3 transition-colors duration-300">
                        <i className="bi bi-calendar-event text-blue-500"></i> Upcoming Events
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? <div className="text-white">Loading events...</div> : upcomingEvents.map(event => (
                        <div key={event.id} className="dark:bg-slate-800 bg-white rounded-2xl shadow-lg border dark:border-slate-700 border-slate-100 overflow-hidden hover:shadow-xl dark:hover:shadow-blue-500/10 transition-all duration-300 group">
                            <div className="h-48 overflow-hidden relative">
                                <img src={event.image_url || "/assets/images/home/security-ops.jpg"} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => e.target.src = 'https://placehold.co/600x400/1e293b/white?text=Event'} />
                                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {event.event_type}
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="text-sm text-blue-500 font-bold mb-2 uppercase tracking-wide">
                                    {event.start_date}
                                </div>
                                <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-3 group-hover:text-blue-500 transition-colors duration-300">
                                    {event.name}
                                </h3>
                                <p className="dark:text-slate-400 text-slate-600 mb-6 leading-relaxed transition-colors duration-300">
                                    {event.description}
                                </p>
                                <Link to="/contact" className="w-full py-3 rounded-xl border-2 dark:border-slate-600 border-slate-900 dark:text-slate-300 text-slate-900 font-bold dark:hover:bg-slate-700 hover:bg-slate-900 hover:text-white transition-all duration-300 block text-center">
                                    Register Now
                                </Link>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </section>

            <SectionDivider variant="angle" from="light" to="dark" />

            {/* Past Events â€” DARK for alternation */}
            <section className="py-20 dark:bg-slate-950 bg-slate-900 text-white relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-8 text-center tracking-tight transition-colors duration-300">Past Recordings</h2>
                        <div className="dark:bg-slate-900 bg-slate-800 rounded-2xl shadow-sm border dark:border-slate-800 border-slate-700 divide-y dark:divide-slate-800 divide-slate-700 transition-colors duration-300">
                            {loading ? <div className="text-white">Loading...</div> : pastEvents.map(event => (
                                <div key={event.id} className="p-6 flex items-center justify-between dark:hover:bg-slate-800 hover:bg-slate-700 transition-colors duration-300">
                                    <div>
                                        <h4 className="font-bold text-white mb-1 transition-colors duration-300">{event.name}</h4>
                                        <div className="text-sm dark:text-slate-500 text-slate-400 transition-colors duration-300">Recorded on {event.end_date || event.start_date}</div>
                                    </div>
                                    <Link to="/resources/podcasts" className="text-blue-400 font-bold text-sm flex items-center gap-2 hover:text-blue-300 transition-colors duration-300">
                                        <i className="bi bi-play-circle-fill"></i> Watch
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-10">
                            <Link to="/resources/podcasts" className="text-slate-400 font-semibold hover:text-white transition-colors inline-flex items-center">View Full Archive <i className="bi bi-arrow-right ml-2"></i></Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Events;

