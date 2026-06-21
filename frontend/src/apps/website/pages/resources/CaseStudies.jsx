import React, { useState } from 'react';
import SectionDivider from '../../../../core/components/SectionDivider';
import PageMeta from '../../../../core/components/shared/PageMeta';
import { Link } from 'react-router-dom';

const CaseStudies = () => {
    const [activeFilter, setActiveFilter] = useState('All');

    const studies = [
        {
            industry: "Financial Services",
            company: "Global Capital Partners",
            tags: ["Security", "Cloud"],
            challenge: "Legacy infrastructure vulnerable to ransomware and failing SEC compliance audits.",
            solution: "Implemented BitGuard Zero Trust architecture, migrated 400 servers to secure AWS enclave, and deployed 24/7 MDR.",
            roi: "100% SEC compliance achieved, 0 successful breaches, IT overhead reduced from $120k/mo to $70k/mo.",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: "bi-bank2",
            color: "emerald"
        },
        {
            industry: "Healthcare",
            company: "Metro Health Network",
            tags: ["Security", "Compliance"],
            challenge: "HIPAA violations due to unencrypted data transmission and weak endpoint security across 12 clinics.",
            solution: "Deployed endpoint encryption, identity access management (IAM), and centralized compliance reporting.",
            roi: "Zero HIPAA violations (down from 4 incidents), 300% faster incident response, secure access for 2,000+ medical staff.",
            image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: "bi-heart-pulse",
            color: "rose"
        },
        {
            industry: "Manufacturing",
            company: "Apex Industries",
            tags: ["MSP", "Physical Security"],
            challenge: "Downtime caused by unstable OT (Operational Technology) networks and outdated physical security.",
            solution: "Separated IT/OT networks, deployed AI camera surveillance, and installed next-gen firewalls.",
            roi: "OT uptime increased from 94% to 99.99%, 50% reduction in physical security incidents.",
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: "bi-nut",
            color: "amber"
        },
        {
            industry: "Legal",
            company: "Harrison & Co Law",
            tags: ["Security", "MSP"],
            challenge: "Client data confidentiality at risk from phishing attacks and unmanaged mobile devices.",
            solution: "Rolled out comprehensive MDM (Mobile Device Management), strict MFA, and continuous phishing simulation training.",
            roi: "Phishing click rate dropped from 18% to 0.5%, fully secured mobile fleet of 300 devices.",
            image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: "bi-briefcase",
            color: "indigo"
        },
        {
            industry: "Retail",
            company: "OmniCart Brands",
            tags: ["Digital", "Cloud"],
            challenge: "E-commerce platform crashing during seasonal traffic spikes with slow page load times hurting conversion.",
            solution: "Refactored legacy monolith to microservices on AWS, built custom AI-driven recommendation engine.",
            roi: "Page load time decreased from 4.2s to 0.8s, leading to a 35% increase in conversion rate ($2M+ revenue lift).",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: "bi-cart-fill",
            color: "purple"
        },
        {
            industry: "Logistics",
            company: "Swift Transport",
            tags: ["Physical Security", "MSP"],
            challenge: "Cargo theft at distribution centers and poor visibility across 5 nationwide hubs.",
            solution: "Installed unified access control, license plate recognition cameras, and 24/7 remote SOC monitoring.",
            roi: "Theft incidents reduced to 0, warehouse shrinkage cut by $450k annually, security guard costs reduced by 60%.",
            image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c50a63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: "bi-truck",
            color: "teal"
        }
    ];

    const filters = ["All", "Security", "Cloud", "MSP", "Physical Security", "Digital", "Compliance"];
    const filteredStudies = activeFilter === 'All' ? studies : studies.filter(s => s.tags.includes(activeFilter));

    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen pt-32 pb-20 transition-colors duration-300">
            <PageMeta title="Case Studies" description="See how BitGuard transforms IT operations and secures enterprise networks across various industries." />
            
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2 block">Customer Success</span>
                    <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">
                        Proven Results.<br />Measurable ROI.
                    </h1>
                    <p className="dark:text-slate-400 text-slate-600 text-lg max-w-2xl mx-auto transition-colors duration-300">
                        Discover how organizations rely on BitGuard to secure their digital assets, achieve compliance, and streamline operations.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {filters.map(filter => (
                        <button 
                            key={filter} 
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                                activeFilter === filter 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                <div className="space-y-12">
                    {filteredStudies.map((study, idx) => (
                        <div key={idx} className="dark:bg-slate-900 bg-white rounded-3xl overflow-hidden shadow-xl border dark:border-slate-800 border-slate-200 flex flex-col lg:flex-row transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
                            <div className="lg:w-2/5 relative overflow-hidden">
                                <img src={study.image} alt={study.company} className="w-full h-full object-cover min-h-[300px] group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-8">
                                    <div>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${study.color}-500/20 border border-${study.color}-500/30 text-${study.color}-400 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm`}>
                                            <i className={`bi ${study.icon}`}></i> {study.industry}
                                        </div>
                                        <h3 className="text-3xl font-bold text-white tracking-tight">{study.company}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                                <div className="mb-8">
                                    <h4 className="text-sm font-bold dark:text-slate-400 text-slate-500 uppercase tracking-widest mb-3">The Challenge</h4>
                                    <p className="dark:text-slate-300 text-slate-700 text-lg leading-relaxed">{study.challenge}</p>
                                </div>
                                <div className="mb-8">
                                    <h4 className="text-sm font-bold dark:text-slate-400 text-slate-500 uppercase tracking-widest mb-3">The Solution</h4>
                                    <p className="dark:text-slate-300 text-slate-700 text-lg leading-relaxed">{study.solution}</p>
                                </div>
                                <div className={`p-6 rounded-2xl bg-${study.color}-500/10 border border-${study.color}-500/20`}>
                                    <h4 className={`text-sm font-bold text-${study.color}-600 dark:text-${study.color}-400 uppercase tracking-widest mb-2 flex items-center gap-2`}>
                                        <i className="bi bi-graph-up-arrow"></i> The Outcome & ROI
                                    </h4>
                                    <p className={`font-bold text-lg dark:text-white text-slate-900`}>{study.roi}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-20 text-center">
                    <div className="dark:bg-slate-900 bg-white p-10 rounded-3xl border dark:border-slate-800 border-slate-200 shadow-sm max-w-3xl mx-auto transition-colors duration-300">
                        <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-4 tracking-tight">Ready to transform your IT?</h3>
                        <p className="dark:text-slate-400 text-slate-600 mb-8">Schedule a free assessment with our architecture team to see how BitGuard can protect and optimize your business.</p>
                        <Link to="/contact" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold uppercase tracking-wider transition-colors shadow-lg shadow-blue-500/20">
                            Request Assessment
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseStudies;
