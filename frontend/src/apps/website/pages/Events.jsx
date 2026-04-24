import React from 'react';
import { Link } from 'react-router-dom';
import SectionDivider from '../../../core/components/SectionDivider';
import PageMeta from '../../../core/components/shared/PageMeta';

const Events = () => {
    const upcomingEvents = [
        {
            id: 1,
            title: "Zero Trust Architecture Deep Dive",
            date: "Feb 15, 2026",
            time: "2:00 PM EST",
            type: "Webinar",
            description: "Learn how to implement a Zero Trust security model in your organization with practical steps and best practices.",
            image: "/assets/images/home/security-ops.jpg"
        },
        {
            id: 2,
            title: "BitGuard User Conference 2026",
            date: "April 10-12, 2026",
            time: "9:00 AM PST",
            type: "Conference",
            description: "Join us in San Francisco for 3 days of keynotes, workshops, and networking with industry leaders.",
            image: "/assets/images/home/unified.jpg"
        },
        {
            id: 3,
            title: "AI in Cybersecurity: Friend or Foe?",
            date: "March 05, 2026",
            time: "11:00 AM EST",
            type: "Panel Discussion",
            description: "A live panel with our security experts discussing the dual role of AI in modern cyber defense and attacks.",
            image: "/assets/images/home/ai-models.png"
        }
    ];

    const pastEvents = [
        {
            id: 101,
            title: "2025 Security Threat Report Breakdown",
            date: "Jan 10, 2026",
            link: "#"
        },
        {
            id: 102,
            title: "Mastering Cloud Migration",
            date: "Dec 05, 2025",
            link: "#"
        }
    ];

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
                    {upcomingEvents.map(event => (
                        <div key={event.id} className="dark:bg-slate-800 bg-white rounded-2xl shadow-lg border dark:border-slate-700 border-slate-100 overflow-hidden hover:shadow-xl dark:hover:shadow-blue-500/10 transition-all duration-300 group">
                            <div className="h-48 overflow-hidden relative">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => e.target.src = 'https://placehold.co/600x400/1e293b/white?text=Event'} />
                                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {event.type}
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="text-sm text-blue-500 font-bold mb-2 uppercase tracking-wide">
                                    {event.date} • {event.time}
                                </div>
                                <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-3 group-hover:text-blue-500 transition-colors duration-300">
                                    {event.title}
                                </h3>
                                <p className="dark:text-slate-400 text-slate-600 mb-6 leading-relaxed transition-colors duration-300">
                                    {event.description}
                                </p>
                                <button className="w-full py-3 rounded-xl border-2 dark:border-slate-600 border-slate-900 dark:text-slate-300 text-slate-900 font-bold dark:hover:bg-slate-700 hover:bg-slate-900 hover:text-white transition-all duration-300">
                                    Register Now
                                </button>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </section>

            <SectionDivider variant="angle" from="light" to="dark" />

            {/* Past Events — DARK for alternation */}
            <section className="py-20 dark:bg-slate-950 bg-slate-900 text-white relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-8 text-center tracking-tight transition-colors duration-300">Past Recordings</h2>
                        <div className="dark:bg-slate-900 bg-slate-800 rounded-2xl shadow-sm border dark:border-slate-800 border-slate-700 divide-y dark:divide-slate-800 divide-slate-700 transition-colors duration-300">
                            {pastEvents.map(event => (
                                <div key={event.id} className="p-6 flex items-center justify-between dark:hover:bg-slate-800 hover:bg-slate-700 transition-colors duration-300">
                                    <div>
                                        <h4 className="font-bold text-white mb-1 transition-colors duration-300">{event.title}</h4>
                                        <div className="text-sm dark:text-slate-500 text-slate-400 transition-colors duration-300">Recorded on {event.date}</div>
                                    </div>
                                    <button className="text-blue-400 font-bold text-sm flex items-center gap-2 hover:text-blue-300 transition-colors duration-300">
                                        <i className="bi bi-play-circle-fill"></i> Watch
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-10">
                            <button className="text-slate-400 font-semibold hover:text-white transition-colors">View Full Archive <i className="bi bi-arrow-right ml-2"></i></button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Events;
