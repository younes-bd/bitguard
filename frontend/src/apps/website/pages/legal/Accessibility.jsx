import React from 'react';
import SectionDivider from '../../../../core/components/SectionDivider';

const Accessibility = () => {
    return (
        <div className="dark:bg-slate-900 bg-slate-50 min-h-screen pt-32 pb-20 transition-colors duration-300">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold tracking-wider uppercase mb-6">
                        <i className="bi bi-universal-access-circle"></i> Accessibility
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-slate-900 mb-6 tracking-tight">
                        Accessibility Statement
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                        BitGuard is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500 prose-img:rounded-xl">
                    <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Conformance Status</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">
                            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. BitGuard is partially conformant with <strong>WCAG 2.1 level AA</strong>. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Feedback</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            We welcome your feedback on the accessibility of the BitGuard platform. Please let us know if you encounter accessibility barriers on BitGuard:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 mb-8 space-y-2">
                            <li>Phone: 1-800-BIT-GUARD</li>
                            <li>E-mail: accessibility@bitguard.com</li>
                            <li>Visitor Address: 100 Security Blvd, Suite 400, Chicago, IL 60601</li>
                        </ul>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">
                            We try to respond to feedback within 2 business days.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Technical Specifications</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Accessibility of BitGuard relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 mb-8 space-y-2">
                            <li>HTML</li>
                            <li>WAI-ARIA</li>
                            <li>CSS</li>
                            <li>JavaScript</li>
                        </ul>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">
                            These technologies are relied upon for conformance with the accessibility standards used.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Assessment Approach</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            BitGuard evaluated the accessibility of the BitGuard website and platform by the following approaches:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 mb-0 space-y-2">
                            <li>Self-evaluation</li>
                            <li>External evaluation via third-party accessibility audits conducted annually</li>
                        </ul>
                    </div>
                </div>
            </div>
            <SectionDivider variant="curve" from="light" to="dark" />
        </div>
    );
};

export default Accessibility;
