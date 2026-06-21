
"""
Content for dynamic service pages.
Maps slug -> context dictionary.
"""

SERVICES = {
    # --- PLATFORM ---
    'platform-overview': {
        'title': 'BitGuard Platform Overview',
        'subtitle': 'Unified Security & Management',
        'description': 'The all-in-one platform to assess, defend, and control your digital infrastructure.',
        'icon': 'fas fa-layer-group',
        'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
        'hero_image': 'base/assets/images/home/unified.jpg', 
        'content_image': 'base/assets/images/home/ai-models.png',
        'features': [
            {'title': 'Centralized Dashboard', 'desc': 'View your entire security posture in one glance.'},
            {'title': 'Real-time Alerts', 'desc': 'Instant notifications for critical security events.'},
            {'title': 'Automated Reports', 'desc': 'Generate compliance and status reports automatically.'}
        ],
        'content': '''
            <p>The BitGuard Platform is the cornerstone of modern IT security and management. 
            Integrate all your tools into a single pane of glass, reducing complexity and improving response times.</p>
            <h3>Key Capabilities</h3>
            <ul class="tw-list-disc tw-pl-5 tw-space-y-2">
                <li>Asset Management & Discovery</li>
                <li>Vulnerability Assessment</li>
                <li>Policy Enforcement</li>
            </ul>
        '''
    },
    'assess': {
        'title': 'Assess & Audit',
        'subtitle': 'Know Your Risks',
        'description': 'Comprehensive vulnerability assessment and risk analysis for your organization.',
        'icon': 'fas fa-search-dollar',
        'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #0891b2 100%)',
        'hero_image': 'base/assets/images/home/search.png',
        'features': [
            {'title': 'Deep Scanning', 'desc': 'Identify hidden vulnerabilities across your network.'},
            {'title': 'Risk Scoring', 'desc': 'Prioritize fixes based on potential business impact.'},
            {'title': 'Compliance Checks', 'desc': 'Ensure you meet HIPAA, GDPR, and other standards.'}
        ],
         'content': '''
            <p>You cannot defend what you do not know. Our Assessment module continuously scans your infrastructure 
            to identify weak points before attackers do.</p>
        '''
    },
    'defend': {
        'title': 'Defend & Protect',
        'subtitle': 'Active Threat Prevention',
        'description': 'Proactive defense mechanisms to stop attacks in real-time.',
        'icon': 'fas fa-shield-virus',
        'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #be123c 100%)',
        'hero_image': 'base/assets/images/home/article3.png', 
        'features': [
            {'title': 'Next-Gen Firewall', 'desc': 'Advanced packet filtering and intrusion prevention.'},
            {'title': 'Endpoint Protection', 'desc': 'Secure every device connecting to your network.'},
            {'title': 'AI Threat Detection', 'desc': 'Machine learning algorithms to spot zero-day attacks.'}
        ],
        'content': '''
            <p>BitGuard Defend provides active protection against malware, ransomware, and phishing attacks.
            Our multi-layered approach ensures that if one defense fails, another acts immediately.</p>
        '''
    },
    'control': {
        'title': 'Control & Governance',
        'subtitle': 'Take Command',
        'description': 'Manage access, enforce policies, and maintain control over your data.',
        'icon': 'fas fa-sliders-h',
        'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #059669 100%)',
        'hero_image': 'base/assets/images/home/api.png',
        'features': [
            {'title': 'Access Control', 'desc': 'Zero-trust architecture for user permissions.'},
            {'title': 'Device Management', 'desc': 'Remote wipe and lock for lost devices.'},
            {'title': 'Data Loss Prevention', 'desc': 'Prevent sensitive data from leaving your organization.'}
        ],
        'content': '''
            <p>Maintain strict control over who accesses what. BitGuard Control allows you to define granular policies
            and enforce them automatically across your entire organization.</p>
        '''
    },
    'security-advisor': {
        'title': 'Security Advisor',
        'subtitle': 'Expert Guidance',
        'description': 'Direct access to security experts and strategic planning.',
        'icon': 'fas fa-user-shield',
        'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #7c3aed 100%)',
        'hero_image': 'base/assets/images/people/man2.jpg',
        'features': [
            {'title': 'Virtual CISO', 'desc': 'Strategic leadership without the full-time cost.'},
            {'title': 'Roadmap Planning', 'desc': 'Align security investments with business goals.'},
            {'title': 'Incident Support', 'desc': 'Expert help when you need it most.'}
        ],
        'content': '''
            <p>Technology is only half the battle. Our Security Advisor service pairs you with seasoned experts
            who help you navigate the complex landscape of cybersecurity regulations and best practices.</p>
        '''
    },

    # --- MANAGED IT ---
    'backup-disaster-recovery': {
        'title': 'Backup & Disaster Recovery',
        'subtitle': 'Business Continuity',
        'description': 'Ensure your business survives any disaster with robust backup solutions.',
        'icon': 'fas fa-database',
        'hero_bg': 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
        'hero_image': 'base/assets/images/home/import.png',
        'features': [
            {'title': 'Cloud Backup', 'desc': 'Secure, off-site storage for your critical data.'},
            {'title': 'Instant Restore', 'desc': 'Get back online in minutes, not days.'},
            {'title': 'Ransomware Protection', 'desc': 'Immutable backups that hackers cannot delete.'}
        ],
        'content': '''
            <p>Data loss can bankrupt a business. Our comprehensive BDR solutions ensure that your data is always safe,
            backed up frequently, and easily recoverable in the event of hardware failure, natural disaster, or cyberattack.</p>
        '''
    },
    'managed-detection-response': {
        'title': 'Managed Detection & Response (MDR)',
        'subtitle': '24/7 Threat Hunting',
        'description': 'Continuous monitoring and rapid response to security incidents.',
        'icon': 'fas fa-radar',
        'hero_bg': 'linear-gradient(135deg, #1e293b 0%, #ef4444 100%)',
        'hero_image': 'base/assets/images/home/ai-models.png',
        'content_image': 'base/assets/images/home/article3.png',
        'features': [
            {'title': '24/7 SOC Monitoring', 'desc': 'Eyes on glass around the clock.'},
            {'title': 'Threat Hunting', 'desc': 'Proactively searching for hidden threats.'},
            {'title': 'Rapid Containment', 'desc': 'Isolate infected hosts immediately.'}
        ],
        'content': '''
            <p>MDR goes beyond simple alerts. Our team investigates every suspicious activity and takes action to stops threats
            before they cause damage. It's like having a private security team for your digital assets.</p>
        '''
    },
    'mfa': {
        'title': 'Multi-Factor Authentication',
        'subtitle': 'Secure Access',
        'description': 'Add an essential layer of security to user logins.',
        'icon': 'fas fa-key',
        'hero_bg': 'linear-gradient(135deg, #1e293b 0%, #10b981 100%)',
        'hero_image': 'base/assets/images/home/integrations1.png',
        'features': [
            {'title': 'Biometric Support', 'desc': 'Face ID and Fingerprint compatible.'},
            {'title': 'Push Notifications', 'desc': 'One-tap approval for easy login.'},
            {'title': 'Adaptive Access', 'desc': 'Risk-based challenges for suspicious logins.'}
        ],
        'content': '''
            <p>Passwords are no longer enough. MFA creates a significant barrier for attackers. 
            We implement user-friendly MFA solutions that secure your applications without slowing down your team.</p>
        '''
    },
    'voip-services': {
        'title': 'VoIP Services',
        'subtitle': 'Modern Telephony',
        'description': 'Cloud-based phone systems for the modern workforce.',
        'icon': 'fas fa-phone-alt',
        'hero_bg': 'linear-gradient(135deg, #1e293b 0%, #6366f1 100%)',
        'hero_image': 'base/assets/images/home/multilingual.png',
        'features': [
            {'title': 'Anywhere Access', 'desc': 'Take calls on your desk phone, computer, or mobile.'},
            {'title': 'Video Conferencing', 'desc': 'Integrated HD video meetings.'},
            {'title': 'CRM Integration', 'desc': 'Connect calls directly to customer records.'}
        ],
        'content': '''
            <p>Upgrade from legacy copper lines to a flexible, feature-rich cloud phone system. 
            Scale easily as your team grows and enable remote work seamlessly.</p>
        '''
    },
    'noc': {
        'title': 'Network Operations Center (NOC)',
        'subtitle': 'Infrastructure Management',
        'description': 'Proactive monitoring and maintenance of your IT infrastructure.',
        'icon': 'fas fa-server',
        'hero_bg': 'linear-gradient(135deg, #1e293b 0%, #8b5cf6 100%)',
        'hero_image': 'base/assets/images/home/unified.jpg',
        'features': [
            {'title': 'Uptime Monitoring', 'desc': 'Immediate alerts for outages.'},
            {'title': 'Patch Management', 'desc': 'Keep servers and workstations up to date.'},
            {'title': 'Performance Optimization', 'desc': 'Identify and fix bottlenecks.'}
        ],
        'content': '''
            <p>Let us handle the daily grind of IT maintenance. Our NOC team ensures your servers,
            routers, and switches are healthy, patched, and performing optimally.</p>
        '''
    },

    # --- CYBERSECURITY ---
    'bitguard-bundle': {
        'title': 'The BITGUARD Security Bundle',
        'subtitle': 'Total Protection',
        'description': 'Our all-inclusive package for comprehensive business security.',
        'icon': 'fas fa-cubes',
        'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #fbbf24 100%)',
        'hero_image': 'base/assets/images/home/multi-sub.png',
        'features': [
            {'title': 'Endpoint Protection', 'desc': 'Antivirus and EDR included.'},
            {'title': 'Email Security', 'desc': 'Anti-phishing and spam filtering.'},
            {'title': 'Security Awareness', 'desc': 'Training for your employees.'}
        ],
        'content': '''
            <p>Designed for SMBs, the BitGuard Bundle provides enterprise-grade security at a predictable monthly cost.
            Cover every angle of your attack surface with one simple subscription.</p>
        '''
    },
    'threat-detection': {
         'title': 'Threat Detection & Response',
         'subtitle': 'Stay Ahead of Attackers',
         'description': 'Advanced analytics to identify malicious behavior.',
         'icon': 'fas fa-eye',
         'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #f43f5e 100%)',
         'hero_image': 'base/assets/images/home/prompts2.png',
         'features': [
             {'title': 'Behavioral Analysis', 'desc': 'Detect anomalies in user behavior.'},
             {'title': 'Log Management', 'desc': 'Centralized logging for compliance.'},
             {'title': 'Automated Response', 'desc': 'Block IP addresses automatically.'}
         ],
         'content': '<p>Real-time visibility into your network traffic and system logs allows us to spot intruders fast.</p>'
    },
    'edr': {
        'title': 'Endpoint Detection & Response (EDR)',
        'subtitle': 'Secure Every Device',
        'description': 'Next-generation protection for laptops, desktops, and servers.',
        'icon': 'fas fa-laptop-medical',
        'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #14b8a6 100%)',
        'hero_image': 'base/assets/images/home/article1.png',
        'features': [
            {'title': 'Ransomware Rollback', 'desc': 'Reverse changes made by malware.'},
            {'title': 'Offline Protection', 'desc': 'AI works even without internet.'},
            {'title': 'Deep Forensics', 'desc': 'Understand exactly how an attack happened.'}
        ],
        'content': '<p>Traditional antivirus is dead. EDR uses behavioral AI to stop never-before-seen attacks.</p>'
    },
    'incident-response': {
        'title': 'Incident Response',
        'subtitle': 'Emergency Assistance',
        'description': 'Expert help to recover from cyberattacks.',
        'icon': 'fas fa-ambulance',
        'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #ef4444 100%)',
        'hero_image': 'base/assets/images/home/article3.png',
        'features': [
            {'title': 'Forensic Investigation', 'desc': 'Determine the root cause.'},
            {'title': 'Legal Support', 'desc': 'Guidance on breach notification.'},
            {'title': 'Recovery Planning', 'desc': 'Get back to business safely.'}
        ],
        'content': '<p>When a breach occurs, every second counts. Our IR team is ready to deploy immediately to contain the threat.</p>'
    },
    'vulnerability-scanning': {
        'title': 'Vulnerability Scanning',
        'subtitle': 'Identify Weaknesses',
        'description': 'Regular automated scans to find unpatched software.',
        'icon': 'fas fa-microscope',
        'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #8b5cf6 100%)',
        'hero_image': 'base/assets/images/home/search.png',
        'features': [
            {'title': 'External Scanning', 'desc': 'Test your internet-facing assets.'},
            {'title': 'Internal Scanning', 'desc': 'Find risks inside your firewall.'},
            {'title': 'Reporting', 'desc': 'Detailed technical reports for remediation.'}
        ],
        'content': '<p>Automated scanning ensures you never miss a critical patch or misconfiguration.</p>'
    },
    'compliance-audit': {
        'title': 'Compliance & Audit',
        'subtitle': 'Meet Regulations',
        'description': 'Consulting and tools to achieve compliance.',
        'icon': 'fas fa-file-contract',
        'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #64748b 100%)',
        'hero_image': 'base/assets/images/home/history.png',
        'features': [
            {'title': 'HIPAA / GDPR', 'desc': 'Healthcare and privacy compliance.'},
            {'title': 'CMMC / NIST', 'desc': 'Government contractor standards.'},
            {'title': 'Gap Analysis', 'desc': 'See where you fall short.'}
        ],
        'content': '<p>Avoid fines and build trust with your customers by demonstrating your commitment to security standards.</p>'
    },

    # --- CLOUD ---
    'microsoft-365': {
        'title': 'Microsoft 365 Services',
        'subtitle': 'Productivity Suite',
        'description': 'Expert management and migration for Office 365.',
        'icon': 'fab fa-microsoft',
        'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #0078d4 100%)',
        'hero_image': 'base/assets/images/home/unified.jpg',
        'features': [{'title': 'Migration', 'desc': 'Move email and files without downtime.'}],
        'content': '<p>Maximize your investment in M365 with our expert setup and security hardening.</p>'
    },
    'azure-aws': {
        'title': 'Azure & AWS Solutions',
        'subtitle': 'Public Cloud',
        'description': 'Architecting and managing cloud infrastructure.',
        'icon': 'fas fa-cloud',
        'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #f97316 100%)',
        'hero_image': 'base/assets/images/home/api.png',
        'features': [{'title': 'Cost Optimization', 'desc': 'Stop overpaying for unused resources.'}],
        'content': '<p>Scale infinitely with properly architected cloud environments on AWS or Azure.</p>'
    },
    'cloud-storage': {
        'title': 'Cloud Storage',
        'subtitle': 'Secure File Share',
        'description': 'Enterprise-grade file storage and syncing.',
        'icon': 'fas fa-hdd',
        'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #22c55e 100%)',
        'hero_image': 'base/assets/images/home/import.png',
        'features': [{'title': 'Encryption', 'desc': 'Data is encrypted at rest and in transit.'}],
        'content': '<p>Replace your old file server with modern, accessible cloud storage.</p>'
    },

    # --- DIGITAL ---
    'web-design': {
        'title': 'Web Design & Development',
        'subtitle': 'Digital Experience',
        'description': 'Stunning websites that convert visitors into customers.',
        'icon': 'fas fa-laptop-code',
        'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #d946ef 100%)',
        'hero_image': 'base/assets/images/home/websearch.png',
        'features': [{'title': 'Responsive Design', 'desc': 'Looks great on any device.'}],
        'content': '<p>Your website is your digital storefront. Make a lasting impression.</p>'
    },
    'design-services': {
        'title': 'Design Services',
        'subtitle': 'Brand Identity',
        'description': 'Logo design, branding, and marketing assets.',
        'icon': 'fas fa-pen-nib',
        'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #ec4899 100%)',
        'hero_image': 'base/assets/images/home/prompts2.png',
        'features': [{'title': 'UI/UX', 'desc': 'User-centric interface design.'}],
        'content': '<p>Consistent, professional branding builds trust.</p>'
    },
    'full-stack': {
        'title': 'Full Stack Development',
        'subtitle': 'Custom Software',
        'description': 'End-to-end development of complex web applications.',
        'icon': 'fas fa-code',
        'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #8b5cf6 100%)',
        'hero_image': 'base/assets/images/home/api.png',
        'features': [{'title': 'Modern Stack', 'desc': 'React, Django, Node.js expertize.'}],
        'content': '<p>We build robust, scalable applications tailored to your business needs.</p>'
    },
    'app-development': {
        'title': 'Application Development',
        'subtitle': 'Mobile & Web',
        'description': 'Native and cross-platform mobile apps.',
        'icon': 'fas fa-mobile-alt',
        'hero_bg': 'linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)',
        'hero_image': 'base/assets/images/home/text-to-image.png',
        'features': [{'title': 'iOS & Android', 'desc': 'Reach customers on every device.'}],
        'content': '<p>Turn your idea into a feature-rich mobile application.</p>'
    },
}
