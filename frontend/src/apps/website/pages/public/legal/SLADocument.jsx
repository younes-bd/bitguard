import React from 'react';
import SectionDivider from '../../../../../core/components/SectionDivider';
import PageMeta from '../../../../../core/components/shared/PageMeta';

const SLADocument = () => {
    return (
        <div className="dark:bg-slate-950 bg-slate-50 min-h-screen pt-32 pb-20 transition-colors duration-300">
            <PageMeta title="Service Level Agreement" description="The public SLA document detailing BitGuard's uptime guarantees, response times, and service credits." />
            
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2 block">Legal & Compliance</span>
                    <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight transition-colors duration-300">
                        Service Level Agreement (SLA)
                    </h1>
                    <p className="dark:text-slate-400 text-slate-600 text-lg">
                        Last Updated: January 15, 2026
                    </p>
                </div>

                <div className="dark:bg-slate-900 bg-white rounded-3xl p-8 md:p-12 shadow-sm border dark:border-slate-800 border-slate-200 prose prose-slate dark:prose-invert max-w-none transition-colors duration-300">
                    <p className="lead text-lg">
                        This Service Level Agreement ("SLA") applies to the use of the BitGuard Enterprise Platform and Managed IT Services. It is incorporated by reference into the Master Services Agreement (MSA).
                    </p>

                    <h2 className="text-2xl font-bold mt-10 mb-4 dark:text-white text-slate-900">1. Service Availability Guarantee</h2>
                    <p>
                        BitGuard guarantees a <strong>99.99% Monthly Uptime Percentage</strong> for the BitGuard Cloud Platform, including the Unified Dashboard, Identity Access Management (IAM), and endpoint telemetry ingestion.
                    </p>
                    <p>
                        "Monthly Uptime Percentage" is calculated by subtracting from 100% the percentage of minutes during the month in which the service was unavailable.
                    </p>

                    <h2 className="text-2xl font-bold mt-10 mb-4 dark:text-white text-slate-900">2. Incident Response Times</h2>
                    <p>
                        Our Global Security Operations Center (SOC) operates 24x7x365. Incidents are classified and responded to based on the following severity levels:
                    </p>

                    <div className="overflow-x-auto my-8">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="dark:bg-slate-800 bg-slate-100 text-sm uppercase tracking-wider dark:text-slate-400 text-slate-600">
                                    <th className="p-4 font-bold border-b dark:border-slate-700 border-slate-200">Severity</th>
                                    <th className="p-4 font-bold border-b dark:border-slate-700 border-slate-200">Description</th>
                                    <th className="p-4 font-bold border-b dark:border-slate-700 border-slate-200">Initial Response</th>
                                    <th className="p-4 font-bold border-b dark:border-slate-700 border-slate-200">Resolution Target</th>
                                </tr>
                            </thead>
                            <tbody className="dark:text-slate-300 text-slate-700">
                                <tr className="border-b dark:border-slate-800 border-slate-100">
                                    <td className="p-4 font-bold text-red-500">P1 (Critical)</td>
                                    <td className="p-4">Active breach, network down, total loss of service</td>
                                    <td className="p-4 font-mono font-bold">&lt; 15 mins</td>
                                    <td className="p-4">Continuous effort until resolved</td>
                                </tr>
                                <tr className="border-b dark:border-slate-800 border-slate-100">
                                    <td className="p-4 font-bold text-orange-500">P2 (High)</td>
                                    <td className="p-4">Severe degradation, core features unavailable</td>
                                    <td className="p-4 font-mono font-bold">&lt; 1 hour</td>
                                    <td className="p-4">Within 4 hours</td>
                                </tr>
                                <tr className="border-b dark:border-slate-800 border-slate-100">
                                    <td className="p-4 font-bold text-blue-500">P3 (Medium)</td>
                                    <td className="p-4">Minor degradation, workaround available</td>
                                    <td className="p-4 font-mono font-bold">&lt; 4 hours</td>
                                    <td className="p-4">Within 24 hours</td>
                                </tr>
                                <tr className="">
                                    <td className="p-4 font-bold text-slate-500">P4 (Low)</td>
                                    <td className="p-4">General questions, cosmetic issues, feature requests</td>
                                    <td className="p-4 font-mono font-bold">&lt; 24 hours</td>
                                    <td className="p-4">Next release / Best effort</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h2 className="text-2xl font-bold mt-10 mb-4 dark:text-white text-slate-900">3. Service Credits</h2>
                    <p>
                        If we do not achieve and maintain the Service Availability Guarantee for the applicable month, you are eligible to receive a Service Credit based on the following schedule:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>&lt; 99.99% but &ge; 99.0%</strong>: 10% of monthly fee</li>
                        <li><strong>&lt; 99.0% but &ge; 95.0%</strong>: 25% of monthly fee</li>
                        <li><strong>&lt; 95.0%</strong>: 100% of monthly fee</li>
                    </ul>
                    <p>
                        To receive a Service Credit, you must submit a claim within thirty (30) days following the end of the month in which the downtime occurred.
                    </p>

                    <h2 className="text-2xl font-bold mt-10 mb-4 dark:text-white text-slate-900">4. SLA Exclusions</h2>
                    <p>The SLA does not apply to any unavailability resulting from:</p>
                    <ol className="list-decimal pl-6 space-y-2 mb-6">
                        <li>Scheduled Maintenance (with at least 48 hours advance notice).</li>
                        <li>Factors outside of our reasonable control, including any force majeure event or internet access issues beyond our network perimeter.</li>
                        <li>Any actions or inactions of you or any third party (e.g., misconfigured client firewalls).</li>
                        <li>Suspension or termination of your right to use the service in accordance with the MSA.</li>
                    </ol>
                    
                    <div className="mt-12 pt-8 border-t dark:border-slate-800 border-slate-200">
                        <p className="text-sm dark:text-slate-500 text-slate-400">
                            For specific details regarding your organization's custom SLA terms, please refer to your Enterprise Master Services Agreement or contact your assigned Technical Account Manager.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SLADocument;
