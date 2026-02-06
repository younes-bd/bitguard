import React from 'react';
import { Link } from 'react-router-dom';

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
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-slate-950 overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/10 blur-[100px] pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Live Sessions & Webinars
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-[Oswald]">
                        Events & Webinars
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                        Connect with experts, learn industry best practices, and stay ahead of the curve.
                    </p>
                </div>
            </section>

            {/* Upcoming Events Grid */}
            <section className="py-20 container mx-auto px-4">
                <h2 className="text-3xl font-bold text-slate-900 mb-10 flex items-center gap-3">
                    <i className="bi bi-calendar-event text-blue-600"></i> Upcoming Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingEvents.map(event => (
                        <div key={event.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow group">
                            <div className="h-48 overflow-hidden relative">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => e.target.src = 'https://placehold.co/600x400/1e293b/white?text=Event'} />
                                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {event.type}
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="text-sm text-blue-600 font-bold mb-2 uppercase tracking-wide">
                                    {event.date} • {event.time}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {event.title}
                                </h3>
                                <p className="text-slate-600 mb-6 leading-relaxed">
                                    {event.description}
                                </p>
                                <button className="w-full py-3 rounded-xl border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-colors">
                                    Register Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Past Events List */}
            <section className="py-20 bg-slate-100 border-t border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Past Recordings</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100">
                            {pastEvents.map(event => (
                                <div key={event.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">{event.title}</h4>
                                        <div className="text-sm text-slate-500">Recorded on {event.date}</div>
                                    </div>
                                    <button className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:underline">
                                        <i className="bi bi-play-circle-fill"></i> Watch
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <button className="text-slate-500 font-semibold hover:text-slate-800">View Archive</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Events;
