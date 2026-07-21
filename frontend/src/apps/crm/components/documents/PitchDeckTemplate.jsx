import React from 'react';
import { Target, Zap, Shield, TrendingUp, Users, CheckCircle } from 'lucide-react';

const PitchDeckTemplate = ({ data }) => {
    return (
        <div className="bg-slate-50 max-w-4xl mx-auto shadow-xl overflow-hidden font-sans" style={{ minHeight: '1056px' }}>
            {/* Title Slide */}
            <div className="bg-slate-900 text-white p-12 flex flex-col justify-center items-center text-center" style={{ minHeight: '400px' }}>
                <div className="w-20 h-20 bg-cyan-500 rounded-2xl flex items-center justify-center mb-8 rotate-12 shadow-lg shadow-cyan-500/30">
                    <Shield className="w-10 h-10 text-white -rotate-12" />
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    {data?.title || 'Enterprise IT Transformation'}
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl">
                    Executive Summary & Strategic Proposal for {data?.clientName || 'Partner'}
                </p>
                <div className="mt-12 text-sm text-slate-400">
                    Prepared by: {data?.companyName || 'BitGuard Solutions'} | {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* The Challenge */}
            <div className="p-12 bg-white">
                <div className="flex items-center gap-4 mb-8">
                    <Target className="w-8 h-8 text-rose-500" />
                    <h2 className="text-3xl font-bold text-slate-900">The Challenge</h2>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <p className="text-slate-600 leading-relaxed text-lg mb-4">
                            In today's digital landscape, organizations face unprecedented challenges in scaling their IT infrastructure while maintaining robust security postures. 
                        </p>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            {data?.challengeText || "Legacy systems often create bottlenecks, reduce operational efficiency, and expose the organization to evolving cyber threats. A unified, modern approach is required to drive growth."}
                        </p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-inner">
                        <h4 className="font-bold text-slate-800 mb-4">Key Pain Points</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0"></span>
                                <span className="text-slate-600">Fragmented IT infrastructure leading to data silos.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0"></span>
                                <span className="text-slate-600">Escalating security threats targeting legacy endpoints.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0"></span>
                                <span className="text-slate-600">High operational overhead and inefficient workflows.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* The Solution */}
            <div className="p-12 bg-slate-50 border-y border-slate-200">
                <div className="flex items-center gap-4 mb-8">
                    <Zap className="w-8 h-8 text-amber-500" />
                    <h2 className="text-3xl font-bold text-slate-900">Our Solution</h2>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Zero-Trust Security</h3>
                        <p className="text-sm text-slate-600">Implementing continuous verification and endpoint protection across your entire network.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Cloud Optimization</h3>
                        <p className="text-sm text-slate-600">Migrating core workloads to scalable cloud infrastructure for 99.99% uptime.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Managed IT Services</h3>
                        <p className="text-sm text-slate-600">24/7 dedicated support desk acting as an extension of your internal team.</p>
                    </div>
                </div>
            </div>

            {/* ROI & Timeline */}
            <div className="p-12 bg-white">
                <div className="grid grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Expected ROI</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <span className="font-medium text-slate-700">Operational Efficiency</span>
                                <span className="text-emerald-600 font-bold text-xl">+45%</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <span className="font-medium text-slate-700">Security Incident Reduction</span>
                                <span className="text-emerald-600 font-bold text-xl">-80%</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <span className="font-medium text-slate-700">Infrastructure Costs</span>
                                <span className="text-emerald-600 font-bold text-xl">-25%</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Execution Timeline</h2>
                        <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
                            <div className="relative pl-6">
                                <div className="absolute w-3 h-3 bg-cyan-500 rounded-full -left-[7px] top-1.5"></div>
                                <h4 className="font-bold text-slate-900">Phase 1: Assessment</h4>
                                <p className="text-sm text-slate-500">Weeks 1-2 • Complete infrastructure audit</p>
                            </div>
                            <div className="relative pl-6">
                                <div className="absolute w-3 h-3 bg-cyan-500 rounded-full -left-[7px] top-1.5"></div>
                                <h4 className="font-bold text-slate-900">Phase 2: Deployment</h4>
                                <p className="text-sm text-slate-500">Weeks 3-6 • Rollout of security & cloud tools</p>
                            </div>
                            <div className="relative pl-6">
                                <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[7px] top-1.5"></div>
                                <h4 className="font-bold text-slate-900">Phase 3: Managed Support</h4>
                                <p className="text-sm text-slate-500">Ongoing • 24/7 monitoring and maintenance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 bg-slate-900 text-center text-slate-400 text-sm">
                Confidential Document • {data?.companyName || 'BitGuard Solutions'} • DO NOT DISTRIBUTE
            </div>
        </div>
    );
};

export default PitchDeckTemplate;
