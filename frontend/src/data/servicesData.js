
const SERVICES = {
    // --- PLATFORM ---
    'platform-overview': {
        title: 'BitGuard Platform Overview',
        subtitle: 'Unified Security & Management',
        description: 'The all-in-one platform to assess, defend, and control your digital infrastructure.',
        icon: 'bi bi-layers-fill',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #1e3a8a 100%)',
        hero_image: '/assets/images/home/unified.jpg',
        content_image: '/assets/images/home/ai-models.png',
        long_description: `
            <p>The BitGuard Platform is the cornerstone of modern IT security and management. In an era where digital threats are evolving daily, 
            fragmented security tools leave gaps that attackers exploit. BitGuard unifies your entire security stack into a single, intuitive pane of glass.</p>
            <p>From real-time vulnerability assessment to automated threat defense and granular access control, our platform empowers your IT team 
            to stop fighting fires and start driving business growth.</p>
        `,
        features: [
            {
                title: 'Centralized Dashboard',
                desc: 'View your entire security posture in one glance. Track KPIs, active threats, and compliance status in real-time.',
                icon: 'bi bi-speedometer2'
            },
            {
                title: 'Real-time Alerts',
                desc: 'Instant notifications for critical security events via Email, SMS, or Slack integration.',
                icon: 'bi bi-bell-fill'
            },
            {
                title: 'Automated Reports',
                desc: 'Generate executive summaries and detailed compliance reports (HIPAA, GDPR, NIST) automatically.',
                icon: 'bi bi-file-earmark-text-fill'
            }
        ],
        benefits: [
            { title: 'Reduce Complexity', description: 'Eliminate tool sprawl by consolidating 10+ security tools into one platform.', icon: 'bi bi-grid-3x3-gap-fill' },
            { title: 'Faster Response', description: 'Cut mean-time-to-respond (MTTR) by 60% with automated remediation workflows.', icon: 'bi bi-hourglass-split' },
            { title: 'Total Visibility', description: 'See every asset, user, and endpoint on your network instantly.', icon: 'bi bi-eye-fill' }
        ],
        process: [
            { step: '01', title: 'Connect', description: 'Install our lightweight agents on your endpoints and cloud services.' },
            { step: '02', title: 'Discover', description: 'The platform automatically maps your network and identifies all assets.' },
            { step: '03', title: 'Secure', description: 'Apply best-practice security policies with a single click.' },
            { step: '04', title: 'Monitor', description: 'Continuous AI monitoring watches for anomalies 24/7.' }
        ],
        why_choose_us: {
            title: 'Why Top Enterprises Trust BitGuard',
            image: '/assets/images/home/dashboard-preview.png',
            points: [
                'Built by security veterans with 20+ years of experience.',
                'Seamless integration with your existing tech stack (AWS, Azure, Microsoft 365).',
                '24/7 dedicated support from certified security analysts.'
            ]
        },
        faq: [
            { question: 'Is the platform cloud-based?', answer: 'Yes, BitGuard is a cloud-native platform, ensuring scalability and remote accessibility.' },
            { question: 'Do I need a large IT team?', answer: 'No, our automation handles the heavy lifting, making it perfect for lean IT teams.' }
        ],
        content: `` // Deprecated, using specific sections now
    },
    'assess': {
        title: 'Assess & Audit',
        subtitle: 'Know Your Risks',
        description: 'Comprehensive vulnerability assessment and risk analysis for your organization.',
        icon: 'bi bi-search',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #0891b2 100%)',
        hero_image: '/assets/images/home/search.png',
        long_description: `
            <p>You cannot defend what you do not know. Blind spots in your infrastructure are the #1 entry point for cyberattacks. 
            Our Assessment module gives you X-ray vision into your IT environment.</p>
            <p>We continuously scan your external perimeter, internal network, and cloud configurations to identify vulnerabilities 
            before bad actors can exploit them. We prioritize risks based on business impact, so you know exactly what to fix first.</p>
        `,
        features: [
            { title: 'Deep Scanning', desc: 'Identify hidden vulnerabilities across your network, servers, and applications.', icon: 'bi bi-upc-scan' },
            { title: 'Risk Scoring', desc: 'Prioritize fixes based on potential business impact and exploitability.', icon: 'bi bi-ui-checks' },
            { title: 'Compliance Checks', desc: 'Ensure you meet HIPAA, GDPR, PCI-DSS, and other critical standards.', icon: 'bi bi-clipboard-check-fill' }
        ],
        benefits: [
            { title: 'Stay Compliant', description: 'Never fail an audit again with continuous compliance tracking.', icon: 'bi bi-shield-check' },
            { title: 'Prioritize Budget', description: 'Spend your security budget where it matters most.', icon: 'bi bi-wallet2' },
            { title: 'Reduce Attack Surface', description: 'Systematically close open doors to your network.', icon: 'bi bi-door-closed-fill' }
        ],
        process: [
            { step: '01', title: 'Scan', description: 'Automated crawlers map your attack surface.' },
            { step: '02', title: 'Analyze', description: 'AI correlates findings to identify true positives.' },
            { step: '03', title: 'Report', description: 'Receive a prioritized list of action items.' }
        ],
        why_choose_us: {
            title: 'Audit-Ready Anytime',
            image: '/assets/images/home/analytics.png',
            points: [
                'Continuous scanning, not just "snapshot" audits.',
                'Detailed technical reports for developers and high-level summaries for executives.',
                'Zero hardware required for deployment.'
            ]
        },
        faq: [
            { question: 'Does scanning slow down my network?', answer: 'No, our adaptive scanners throttle traffic to prevent any performance impact.' },
            { question: 'How often should we scan?', answer: 'We recommend continuous scanning, but offer on-demand options as well.' }
        ],
        content: ``
    },
    'defend': {
        title: 'Defend & Protect',
        subtitle: 'Active Threat Prevention',
        description: 'Proactive defense mechanisms to stop attacks in real-time.',
        icon: 'bi bi-shield-fill-check',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #be123c 100%)',
        hero_image: '/assets/images/home/article3.png',
        long_description: `
            <p>BitGuard Defend provides active protection against malware, ransomware, and phishing attacks. 
            In the modern threat landscape, reactive security is not enough. You need systems that fight back.</p>
            <p>Our multi-layered approach uses AI to analyze file behavior, blocking malicious activity even if the specific signature hasn't been seen before. 
            Whether it's a suspicious email attachment or a drive-by download, we stop it at the gate.</p>
        `,
        features: [
            { title: 'Next-Gen Firewall', desc: 'Advanced packet filtering and intrusion prevention to secure your network perimeter.', icon: 'bi bi-bricks' },
            { title: 'Endpoint Protection', desc: 'Secure every device connecting to your network (laptops, mobiles, IoT).', icon: 'bi bi-laptop' },
            { title: 'AI Threat Detection', desc: 'Machine learning algorithms to spot and block zero-day attacks instantly.', icon: 'bi bi-cpu-fill' }
        ],
        benefits: [
            { title: 'Sleep Soundly', description: 'Rest easy knowing your critical systems are guarded 24/7/365.', icon: 'bi bi-moon-stars-fill' },
            { title: 'Zero Downtime', description: 'Prevent ransomware attacks that lock your data and halt operations.', icon: 'bi bi-server' },
            { title: 'User Safety', description: 'Protect your employees from falling victim to sophisticated phishing cams.', icon: 'bi bi-people-fill' }
        ],
        process: [
            { step: '01', title: 'Deploy', description: 'Roll out endpoint agents to all workstations and servers.' },
            { step: '02', title: 'Configure', description: 'Tune firewall rules and behavior policies to your specific needs.' },
            { step: '03', title: 'Enforce', description: 'Activate blocking mode to automatically stop threats.' }
        ],
        why_choose_us: {
            title: 'Defense in Depth',
            image: '/assets/images/home/security-shield.png',
            points: [
                'Powered by global threat intelligence networks.',
                'Lightweight agents that don\'t slow down your computers.',
                'False-positive reduction with context-aware analysis.'
            ]
        },
        faq: [
            { question: 'Will this block legitimate software?', answer: 'We use allow-listing and behavioral learning to minimize false positives.' },
            { question: 'Does it work for remote workers?', answer: 'Yes, our endpoint protection travels with the device, securing it on any network.' }
        ],
        content: ``
    },
    'control': {
        title: 'Control & Governance',
        subtitle: 'Take Command',
        description: 'Manage access, enforce policies, and maintain control over your data.',
        icon: 'bi bi-sliders',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #059669 100%)',
        hero_image: '/assets/images/home/api.png',
        long_description: `
            <p>Maintain strict control over who accesses what. Data leaks often start from the inside, whether accidental or malicious. 
            BitGuard Control gives you the tools to define granular policies and enforce them automatically.</p>
            <p>From restricting USB drive usage to ensuring only authorized devices can access cloud apps, we help you lock down your sensitive data 
            without hindering productivity.</p>
        `,
        features: [
            { title: 'Access Control', desc: 'Zero-trust architecture ensures users only access what they strictly need.', icon: 'bi bi-person-lock' },
            { title: 'Device Management', desc: 'Remotely wipe lost devices and enforce encryption policies.', icon: 'bi bi-phone' },
            { title: 'Data Loss Prevention', desc: 'Prevent sensitive data (like credit cards or SSNs) from leaving your organization.', icon: 'bi bi-shield-lock-fill' }
        ],
        benefits: [
            { title: 'Prevent Leaks', description: 'Stop accidental data sharing via email or cloud storage.', icon: 'bi bi-x-octagon-fill' },
            { title: 'Regulatory Compliance', description: 'Meet strict data handling requirements automatically.', icon: 'bi bi-journal-check' },
            { title: 'Full Audit Trail', description: 'Know exactly who accessed what file and when.', icon: 'bi bi-list-check' }
        ],
        process: [
            { step: '01', title: 'Audit', description: 'Review current user permissions and data flows.' },
            { step: '02', title: 'Define', description: 'Create clear policies for data access and device usage.' },
            { step: '03', title: 'Automate', description: 'Implement controls that enforce policies without manual intervention.' }
        ],
        why_choose_us: {
            title: 'Granular Control, Simplified',
            image: '/assets/images/home/dashboard-preview.png',
            points: [
                'Zero Trust implementation made easy.',
                'Seamless integration with Active Directory and Okta.',
                'Real-time blocking of unauthorized data transfers.'
            ]
        },
        faq: [
            { question: 'Is it difficult to set up?', answer: 'We provide pre-built policy templates for common industries to get you started fast.' },
            { question: 'Can I monitor user activity?', answer: 'Yes, detailed logs are kept for all data access and transfer activities.' }
        ],
        content: ``
    },
    'security-advisor': {
        title: 'Security Advisor',
        subtitle: 'Expert Guidance',
        description: 'Direct access to security experts and strategic planning.',
        icon: 'bi bi-person-badge',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #7c3aed 100%)',
        hero_image: '/assets/images/people/man2.jpg',
        long_description: `
            <p>Technology is only half the battle. Our Security Advisor service pairs you with seasoned experts who help you navigate 
            the complex landscape of cybersecurity regulations, best practices, and strategic planning.</p>
            <p>Think of us as your virtual CISO. We help you align your security investments with your business goals, ensuring you 
            get the maximum ROI while keeping your organization safe.</p>
        `,
        features: [
            { title: 'Virtual CISO', desc: 'Strategic leadership and board-level reporting without the full-time cost.', icon: 'bi bi-person-workspace' },
            { title: 'Roadmap Planning', desc: 'Align security maturity goals with your 1, 3, and 5-year business plans.', icon: 'bi bi-map' },
            { title: 'Incident Support', desc: 'Expert guidance on retainer when you face a security crisis.', icon: 'bi bi-life-preserver' }
        ],
        benefits: [
            { title: 'Expertise on Demand', description: 'Access top-tier talent without the recruiting headache.', icon: 'bi bi-mortarboard-fill' },
            { title: 'Cost Effective', description: 'Fraction of the cost of hiring a full-time Chief Information Security Officer.', icon: 'bi bi-cash-coin' },
            { title: 'Unbiased Advice', description: 'Vendor-neutral recommendations focused on your needs, not sales commissions.', icon: 'bi bi-chat-square-text-fill' }
        ],
        process: [
            { step: '01', title: 'Align', description: 'Understand your business goals and current risk appetite.' },
            { step: '02', title: 'Plan', description: 'Develop a strategic security roadmap.' },
            { step: '03', title: 'Execute', description: 'Guide your team through implementation and ongoing improvement.' }
        ],
        why_choose_us: {
            title: 'Veterans in Your Corner',
            image: '/assets/images/people/women1.jpg',
            points: [
                'Advisors with CISSP, CISM, and CISA certifications.',
                'Experience across finance, healthcare, and government sectors.',
                'Proactive communication, not just reactive support.'
            ]
        },
        faq: [
            { question: 'Is this a one-time service?', answer: 'We offer both one-time assessments and ongoing retainer relationships.' },
            { question: 'Do you help with audits?', answer: 'Yes, we can lead your preparation for SOC2, ISO 27001, and other audits.' }
        ],
        content: ``
    },

    // --- MANAGED IT ---
    // --- MANAGED IT ---
    'backup-disaster-recovery': {
        title: 'Backup & Disaster Recovery',
        subtitle: 'Business Continuity',
        description: 'Ensure your business survives any disaster with robust backup solutions.',
        icon: 'bi bi-database-fill',
        hero_bg: 'linear-gradient(135deg, #02366b 0%, #3b82f6 100%)',
        hero_image: '/assets/images/home/import.png',
        long_description: `
            <p>Data loss can bankrupt a business. Whether it's hardware failure, a natural disaster, or a ransomware attack, 
            you need a guarantee that your data is safe and recoverable. Our BDR solutions provide that peace of mind.</p>
            <p>We don't just backup your files; we snapshot your entire servers. This allows for "bare metal" restoration or even 
            instant virtualization in the cloud, keeping your business running even if your physical office is destroyed.</p>
        `,
        features: [
            { title: 'Cloud Integration', desc: 'Hybrid backup stores data locally for speed and in the cloud for redundancy.', icon: 'bi bi-cloud-arrow-up-fill' },
            { title: 'Instant Restore', desc: 'Virtualize failed servers instantly to get back online in minutes, not days.', icon: 'bi bi-stopwatch-fill' },
            { title: 'Ransomware Protection', desc: 'Immutable backups prevent hackers from deleting or encrypting your archives.', icon: 'bi bi-shield-lock' }
        ],
        benefits: [
            { title: 'Minimize Downtime', description: 'Turn potential business-ending events into minor inconveniences.', icon: 'bi bi-graph-down-arrow' },
            { title: 'Regulatory Compliance', description: 'Meet data retention requirements for legal and industry standards.', icon: 'bi bi-file-text-fill' },
            { title: 'Peace of Mind', description: 'Focus on your business knowing your data is indestructible.', icon: 'bi bi-heart-fill' }
        ],
        process: [
            { step: '01', title: 'Audit', description: 'Identify critical data and RTO/RPO objectives.' },
            { step: '02', title: 'Implement', description: 'Deploy backup appliances and cloud connectors.' },
            { step: '03', title: 'Test', description: 'Regularly simulate disasters to prove recoverability.' }
        ],
        why_choose_us: {
            title: 'Recover from Anything',
            image: '/assets/images/home/server-room.png',
            points: [
                'Daily backup verification by human technicians.',
                'Geo-redundant cloud storage data centers.',
                'Quarterly disaster recovery drills included.'
            ]
        },
        faq: [
            { question: 'How far back can we go?', answer: 'Retention policies are customizable, from days to infinity.' },
            { question: 'Is my data encrypted?', answer: 'Yes, data is encrypted with AES-256 before it ever leaves your building.' }
        ],
        content: ``
    },
    'managed-detection-response': {
        title: 'Managed Detection & Response (MDR)',
        subtitle: '24/7 Threat Hunting',
        description: 'Continuous monitoring and rapid response to security incidents.',
        icon: 'bi bi-radar',
        hero_bg: 'linear-gradient(135deg, #02366b 0%, #ef4444 100%)',
        hero_image: '/assets/images/home/ai-models.png',
        content_image: '/assets/images/home/article3.png',
        long_description: `
            <p>MDR goes beyond simple alerts. It's comprehensive security-as-a-service. Our Security Operations Center (SOC) 
            monitors your environment 24/7, investigating every suspicious activity so you don't have to.</p>
            <p>If a threat is confirmed, we don't just email you—we take immediate action to isolate the infected host and stop the attack 
            before it spreads. It's like having a private security army guarding your digital assets.</p>
        `,
        features: [
            { title: '24/7 SOC Monitoring', desc: 'Real human analysts watching your network around the clock.', icon: 'bi bi-headset' },
            { title: 'Threat Hunting', desc: 'Proactively searching your network for threats that evaded defenses.', icon: 'bi bi-search-heart' },
            { title: 'Rapid Containment', desc: 'Isolate compromised endpoints remotely within seconds of detection.', icon: 'bi bi-slash-circle-fill' }
        ],
        benefits: [
            { title: 'Expertise', description: 'Gain access to a team of certified security analysts for a flat fee.', icon: 'bi bi-people' },
            { title: 'Reduced Noise', description: 'We filter out the False Positives so you only see what matters.', icon: 'bi bi-speaker' },
            { title: 'Lower Risk', description: 'Drastically reduce the likelihood of a successful data breach.', icon: 'bi bi-shield-check' }
        ],
        process: [
            { step: '01', title: 'Onboard', description: 'Deploy sensors and integrate log sources.' },
            { step: '02', title: 'Baseline', description: 'AI learns "normal" behavior for your network.' },
            { step: '03', title: 'Protect', description: 'Live monitoring and response begins.' }
        ],
        why_choose_us: {
            title: 'We Hunt What Others Miss',
            image: '/assets/images/home/analytics.png',
            points: [
                'Integration with global threat intelligence feeds.',
                'Transparent reporting—see exactly what we see.',
                'Incident Response included in the monthly fee.'
            ]
        },
        faq: [
            { question: 'Do I need this if I have antivirus?', answer: 'Yes. Antivirus stops known files; MDR detects active hacking behavior.' },
            { question: 'What is the response time?', answer: 'Our SLA guarantees investigation start within 15 minutes of a critical alert.' }
        ],
        content: ``
    },
    'mfa': {
        title: 'Multi-Factor Authentication',
        subtitle: 'Secure Access',
        description: 'Add an essential layer of security to user logins.',
        icon: 'bi bi-key-fill',
        hero_bg: 'linear-gradient(135deg, #02366b 0%, #10b981 100%)',
        hero_image: '/assets/images/home/integrations1.png',
        long_description: `
            <p>Passwords are no longer enough. With 81% of breaches caused by stolen credentials, MFA is the single most effective 
            security control you can implement. It creates a critical second barrier that attackers cannot bypass easily.</p>
            <p>We deploy user-friendly MFA solutions that secure your applications (Office 365, VPN, Salesforce, etc.) without slowing down your team. 
            From push notifications to biometrics, security has never been this seamless.</p>
        `,
        features: [
            { title: 'Biometric Support', desc: 'Login with Face ID or Fingerprint for instant access.', icon: 'bi bi-fingerprint' },
            { title: 'Push Notifications', desc: 'One-tap approval on your phone—no typing codes required.', icon: 'bi bi-phone-vibrate' },
            { title: 'Adaptive Access', desc: 'Systems challenge users only when risk is detected (e.g., new location).', icon: 'bi bi-shield-lock' }
        ],
        benefits: [
            { title: 'Stop Account Takeover', description: 'Render stolen passwords useless to hackers.', icon: 'bi bi-person-x' },
            { title: 'Meet Insurance Requirements', description: 'MFA is now mandatory for almost all Cyber Insurance policies.', icon: 'bi bi-file-medical' },
            { title: 'Single Sign-On', description: 'Combine with SSO to reduce password fatigue.', icon: 'bi bi-box-arrow-in-right' }
        ],
        process: [
            { step: '01', title: 'Integrate', description: 'Connect MFA to your core applications.' },
            { step: '02', title: 'Enroll', description: 'Help users register their devices.' },
            { step: '03', title: 'Enforce', description: 'Make MFA mandatory for all external access.' }
        ],
        why_choose_us: {
            title: 'Secure Yet Simple',
            image: '/assets/images/home/mobile-app.png',
            points: [
                'Supported on iOS, Android, and Hardware Tokens.',
                'Geofencing capabilities to block logins from unauthorized countries.',
                'Self-service portal for users to manage their devices.'
            ]
        },
        faq: [
            { question: 'What if I lose my phone?', answer: 'Admins can generate temporary bypass codes to get you in quickly.' },
            { question: 'Does IT have to manage this?', answer: 'We handle the entire lifecycle, from setup to user support.' }
        ],
        content: ``
    },
    'voip-services': {
        title: 'VoIP Services',
        subtitle: 'Modern Telephony',
        description: 'Cloud-based phone systems for the modern workforce.',
        icon: 'bi bi-telephone-fill',
        hero_bg: 'linear-gradient(135deg, #02366b 0%, #6366f1 100%)',
        hero_image: '/assets/images/home/multilingual.png',
        long_description: `
            <p>Break free from the desk. Modern business moves fast, and your phone system should too. Our VoIP solutions 
            empower your team to communicate from anywhere—office, home, or on the road—using the same business number.</p>
            <p>More than just calls, our unified communication platform integrates video meetings, chat, and CRM data, turning 
            every conversation into a productive interaction.</p>
        `,
        features: [
            { title: 'Anywhere Access', desc: 'Seamlessly switch calls between your desk phone and mobile app.', icon: 'bi bi-phone-landscape' },
            { title: 'Video Conferencing', desc: 'Host HD video meetings with screen sharing directly from the app.', icon: 'bi bi-camera-video-fill' },
            { title: 'CRM Integration', desc: 'Pop up customer details automatically when they call.', icon: 'bi bi-person-lines-fill' }
        ],
        benefits: [
            { title: 'Cost Savings', description: 'Eliminate expensive copper lines and hardware maintenance costs.', icon: 'bi bi-piggy-bank' },
            { title: 'Scalability', description: 'Add new extensions instantly as your team grows.', icon: 'bi bi-arrows-angle-expand' },
            { title: 'Professional Image', description: 'Enterprise features like Auto-Attendant for any size business.', icon: 'bi bi-building' }
        ],
        process: [
            { step: '01', title: 'Port', description: 'We port your existing numbers to our service.' },
            { step: '02', title: 'Setup', description: 'Configure call flows and user extensions.' },
            { step: '03', title: 'Train', description: 'Show your team how to use the advanced features.' }
        ],
        why_choose_us: {
            title: 'Crystal Clear Communication',
            image: '/assets/images/home/video-call.png',
            points: [
                '99.999% uptime guarantee.',
                'Free IP phones included with 3-year agreements.',
                'US-based support team.'
            ]
        },
        faq: [
            { question: 'Can I keep my number?', answer: 'Yes, we handle the porting process for you completely.' },
            { question: 'Do I need special internet?', answer: 'Standard business broadband is sufficient for high-quality voice.' }
        ],
        content: ``
    },
    'noc': {
        title: 'Network Operations Center (NOC)',
        subtitle: 'Infrastructure Management',
        description: 'Proactive monitoring and maintenance of your IT infrastructure.',
        icon: 'bi bi-hdd-server',
        hero_bg: 'linear-gradient(135deg, #02366b 0%, #8b5cf6 100%)',
        hero_image: '/assets/images/home/unified.jpg',
        long_description: `
            <p>Your IT infrastructure is the engine of your business. If it sputters, your business slows down. Our Network Operations Center (NOC) 
            acts as your dedicated mechanic, ensuring that engine is always tuned, oiled, and running at peak performance.</p>
            <p>We handle the unglamorous but critical backend work—patching servers, updating firmware, cleaning logs, and monitoring uptime—so 
            your internal team can focus on strategic projects.</p>
        `,
        features: [
            { title: 'Uptime Monitoring', desc: 'We know about outages before you do and start fixing immediately.', icon: 'bi bi-activity' },
            { title: 'Patch Management', desc: 'Keep servers and workstations compliant with the latest security updates.', icon: 'bi bi-bandaid-fill' },
            { title: 'Performance Tuning', desc: 'Identify and fix bottlenecks to speed up your applications.', icon: 'bi bi-speedometer' }
        ],
        benefits: [
            { title: 'Stability', description: 'Drastically reduce random crashes and slow-downs.', icon: 'bi bi-hdd-network' },
            { title: 'Security', description: 'A patched system is a secure system.', icon: 'bi bi-shield-check' },
            { title: 'predictability', description: 'Move from "break-fix" chaos to a predictable IT environment.', icon: 'bi bi-calendar-check' }
        ],
        process: [
            { step: '01', title: 'Agent', description: 'Install monitoring agents on all infrastructure.' },
            { step: '02', title: 'Tune', description: 'Customize alert thresholds to avoid noise.' },
            { step: '03', title: 'Manage', description: 'We take over the daily maintenance tasks.' }
        ],
        why_choose_us: {
            title: 'Your IT Safety Net',
            image: '/assets/images/home/server-rack.png',
            points: [
                'Support for Windows, Linux, and Mac environments.',
                'Detailed monthly health reports.',
                'Included antivirus licensing.'
            ]
        },
        faq: [
            { question: 'Does this replace my IT guy?', answer: 'It can, or we can work alongside them to handle the backend grunt work.' },
            { question: 'When do you patch?', answer: 'We schedule patches during off-hours to ensure zero disruption.' }
        ],
        content: ``
    },

    // --- CYBERSECURITY ---
    // --- CYBERSECURITY ---
    'bitguard-bundle': {
        title: 'The BITGUARD Security Bundle',
        subtitle: 'Total Protection',
        description: 'Our all-inclusive package for comprehensive business security.',
        icon: 'bi bi-box-seam-fill',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #fbbf24 100%)',
        hero_image: '/assets/images/home/multi-sub.png',
        long_description: `
            <p>Security is complex, but buying it shouldn't be. The BitGuard Bundle wraps up all our essential security services 
            into one affordable, easy-to-manage package. Designed specifically for SMBs who need enterprise-grade protection 
            without the enterprise price tag.</p>
            <p>From endpoint antivirus to email filtering and employee training, we cover every angle of your attack surface 
            with one simple subscription.</p>
        `,
        features: [
            { title: 'Endpoint Protection', desc: 'Antivirus and EDR for all your workstations.', icon: 'bi bi-shield-check' },
            { title: 'Email Security', desc: 'Advanced filtering to stop phishing and spam before it hits your inbox.', icon: 'bi bi-envelope-x' },
            { title: 'Security Awareness', desc: 'Automated phishing simulations and training for your employees.', icon: 'bi bi-mortarboard' }
        ],
        benefits: [
            { title: 'Cost Predictability', description: 'One flat rate per user, per month. No hidden fees.', icon: 'bi bi-tag-fill' },
            { title: 'Simplified Vendor Management', description: 'Stop juggling 10 different security invoices.', icon: 'bi bi-receipt' },
            { title: 'Complete Coverage', description: 'No gaps in your defense. We cover people, process, and technology.', icon: 'bi bi-check-all' }
        ],
        process: [
            { step: '01', title: 'Audit', description: 'We inventory your current licenses and tools.' },
            { step: '02', title: 'Consolidate', description: 'Replace disparate tools with the integrated BitGuard suite.' },
            { step: '03', title: 'Train', description: 'Onboard your team to the new security tools.' }
        ],
        why_choose_us: {
            title: 'Security Made Simple',
            image: '/assets/images/home/dashboard-preview.png',
            points: [
                'Designed specifically for companies with 10-500 employees.',
                'Includes $1M ransomware warranty.',
                'Quarterly security business reviews.'
            ]
        },
        faq: [
            { question: 'Is there a contract?', answer: 'We offer flexible 1-year and 3-year term options.' },
            { question: 'Can I add services later?', answer: 'Absolutely. The bundle is the foundation you can build upon.' }
        ],
        content: ``
    },
    'threat-detection': {
        title: 'Threat Detection & Response',
        subtitle: 'Stay Ahead of Attackers',
        description: 'Advanced analytics to identify malicious behavior.',
        icon: 'bi bi-eye-fill',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #f43f5e 100%)',
        hero_image: '/assets/images/home/prompts2.png',
        long_description: `
            <p>Hackers don't always use malware. They use stolen credentials, leverage system tools, and hide in plain sight. 
            BitGuard Threat Detection uses advanced behavioural analytics to spot these "living off the land" attacks.</p>
            <p>By collecting and correlating logs from your firewalls, servers, and cloud services, we create a complete picture of 
            risk across your organization, allowing us to spot the subtle signs of a breach.</p>
        `,
        features: [
            { title: 'Behavioral Analysis', desc: 'AI establishes a baseline for normal user activity and flags anomalies.', icon: 'bi bi-person-bounding-box' },
            { title: 'Log Management', desc: 'Centralized retention of logs for compliance and forensics.', icon: 'bi bi-journal-album' },
            { title: 'Automated Response', desc: 'Automatically block IPs or disable accounts showing suspicious behavior.', icon: 'bi bi-robot' }
        ],
        benefits: [
            { title: 'Detect Insider Threats', description: 'Catch employees who might be stealing data or acting maliciously.', icon: 'bi bi-person-exclamation' },
            { title: 'Meet Compliance', description: 'Satisfy log retention requirements for PCI-DSS, HIPAA, etc.', icon: 'bi bi-file-earmark-check' },
            { title: 'Reduce Dwell Time', description: 'Evict attackers days or months earlier than industry average.', icon: 'bi bi-clock-history' }
        ],
        process: [
            { step: '01', title: 'Collect', description: 'Ingest logs from all your systems.' },
            { step: '02', title: 'Correlate', description: 'SIEM engine identifies patterns across sources.' },
            { step: '03', title: 'Triange', description: 'Human analysts verify high-priority alerts.' }
        ],
        why_choose_us: {
            title: 'Intelligence-Driven Defense',
            image: '/assets/images/home/analytics.png',
            points: [
                'Proprietary detection rules updated daily.',
                'Integration with 300+ log sources.',
                'Full audit trail for every alert.'
            ]
        },
        faq: [
            { question: 'Do I need a SIEM?', answer: 'We provide the SIEM capabilities as part of this service, so you don\'t have to buy one.' },
            { question: 'How long are logs kept?', answer: 'Standard retention is 1 year, but can be extended to 7 years.' }
        ],
        content: ``
    },
    'edr': {
        title: 'Endpoint Detection & Response (EDR)',
        subtitle: 'Secure Every Device',
        description: 'Next-generation protection for laptops, desktops, and servers.',
        icon: 'bi bi-laptop',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #14b8a6 100%)',
        hero_image: '/assets/images/home/article1.png',
        long_description: `
            <p>Traditional antivirus relies on "signatures" of known viruses. It's useless against new, unknown attacks. 
            EDR (Endpoint Detection and Response) is the evolution of antivirus.</p>
            <p>Our EDR solution records the "story" of every process on your computer. If a benign-looking Word document suddenly 
            starts trying to encrypt your files, EDR sees the behavior, kills the process, and rolls back the changes instantly.</p>
        `,
        features: [
            { title: 'Ransomware Rollback', desc: 'One-click feature revitalizes encrypted files to their pre-infection state.', icon: 'bi bi-arrow-counterclockwise' },
            { title: 'Offline Protection', desc: 'AI engine works directly on the device, protecting you even without internet.', icon: 'bi bi-wifi-off' },
            { title: 'Deep Forensics', desc: 'Visual timeline shows exactly how an attacker entered and what they did.', icon: 'bi bi-diagram-3' }
        ],
        benefits: [
            { title: 'Block Zero-Days', description: 'Stop attacks that have never been seen before.', icon: 'bi bi-shield-x' },
            { title: 'Lightweight', description: 'Uses less system resources than traditional antivirus.', icon: 'bi bi-speedometer2' },
            { title: 'Remote Response', description: 'We can remote shell into infected devices to fix them anywhere.', icon: 'bi bi-terminal' }
        ],
        process: [
            { step: '01', title: 'Remove', description: 'Uninstall legacy antivirus software.' },
            { step: '02', title: 'Install', description: 'Deploy BitGuard EDR agent.' },
            { step: '03', title: 'Monitor', description: 'Verify healthy status in our console.' }
        ],
        why_choose_us: {
            title: 'Battle-Tested Technology',
            image: '/assets/images/home/security-shield.png',
            points: [
                'Uses the same tech protecting Fortune 500 companies.',
                'Managed 24/7 by our SOC.',
                'No reboot required for installation.'
            ]
        },
        faq: [
            { question: 'Does it work on Mac/Linux?', answer: 'Yes, full feature parity across Windows, macOS, and Linux.' },
            { question: 'Can I uninstall it?', answer: 'The agent is tamper-proof and requires a unique code to remove.' }
        ],
        content: ``
    },
    'incident-response': {
        title: 'Incident Response',
        subtitle: 'Emergency Assistance',
        description: 'Expert help to recover from cyberattacks.',
        icon: 'bi bi-activity',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #ef4444 100%)',
        hero_image: '/assets/images/home/article3.png',
        long_description: `
            <p>If you have been breached, panic is your enemy. You need a calm, experienced team to guide you through the fire. 
            BitGuard's Incident Response (IR) team drops in to stop the bleeding, investigate the root cause, and get you back in business.</p>
            <p>From ransomware negotiation to legal chain-of-custody for evidence, we handle the entire crisis management lifecycle 
            so you can focus on your stakeholders.</p>
        `,
        features: [
            { title: 'Forensic Investigation', desc: 'Determine patient zero and the full scope of the compromise.', icon: 'bi bi-zoom-in' },
            { title: 'Legal Support', desc: 'We work with your counsel to handle breach notifications and regulatory filings.', icon: 'bi bi-briefcase' },
            { title: 'Recovery Planning', desc: 'Systematic restoration of services to ensure no reinfection occurs.', icon: 'bi bi-check-circle' }
        ],
        benefits: [
            { title: 'Speed', description: 'Boots on the ground (virtual or physical) within 4 hours.', icon: 'bi bi-stopwatch' },
            { title: 'Discretion', description: 'We prioritize confidentiality and reputation management.', icon: 'bi bi-eye-slash' },
            { title: 'Experience', description: 'We fight these battles every day. We know the enemy.', icon: 'bi bi-trophy-fill' }
        ],
        process: [
            { step: '01', title: 'Contain', description: 'Stop the attack from spreading further.' },
            { step: '02', title: 'Eradicate', description: 'Remove the attacker and their backdoors.' },
            { step: '03', title: 'Recover', description: 'Restore systems and data safely.' }
        ],
        why_choose_us: {
            title: 'We Have Your Back',
            image: '/assets/images/people/man2.jpg',
            points: [
                'Retainer clients get guaranteed SLAs.',
                'Access to ransomware negotiators.',
                'Post-incident report with concrete recommendations.'
            ]
        },
        faq: [
            { question: 'What if I am not a client?', answer: 'We accept emergency emergency cases, but retainers have priority capability.' },
            { question: 'Do you work with insurance?', answer: 'Yes, we are approved by major cyber insurance carriers.' }
        ],
        content: ``
    },
    'vulnerability-scanning': {
        title: 'Vulnerability Scanning',
        subtitle: 'Identify Weaknesses',
        description: 'Regular automated scans to find unpatched software.',
        icon: 'bi bi-binoculars-fill',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #8b5cf6 100%)',
        hero_image: '/assets/images/home/search.png',
        long_description: `
            <p>New vulnerabilities are discovered every day. If you scanned your network last month, you are already out of date. 
            Automated Vulnerability Scanning acts as a continuous health check for your IT environment.</p>
            <p>We verify that your servers, firewalls, and applications are patched against the latest CVEs (Common Vulnerabilities and Exposures), 
            giving you a to-do list to keep your fortress secure.</p>
        `,
        features: [
            { title: 'External Scanning', desc: 'See your network from a hacker\'s perspective (internet-facing).', icon: 'bi bi-globe' },
            { title: 'Internal Scanning', desc: 'Find vulnerabilities inside your firewall (lateral movement risk).', icon: 'bi bi-hdd-network' },
            { title: 'Reporting', desc: 'Detailed technical reports for admins and trend reports for management.', icon: 'bi bi-file-text' }
        ],
        benefits: [
            { title: 'Proactive', description: 'Fix holes before they can be exploited.', icon: 'bi bi-cone-striped' },
            { title: 'Automated', description: 'Set it and forget it. We notify you only when issues arise.', icon: 'bi bi-robot' },
            { title: 'Verified', description: 'Rescan capabilities to confirm that patches were applied correctly.', icon: 'bi bi-check2-all' }
        ],
        process: [
            { step: '01', title: 'Scan', description: 'Scanner probes your IPs and domains.' },
            { step: '02', title: 'Prioritize', description: 'Rank findings by Critical/High/Medium/Low.' },
            { step: '03', title: 'Remediate', description: 'Apply patches or configuration changes.' }
        ],
        why_choose_us: {
            title: 'Comprehensive Visibility',
            image: '/assets/images/home/analytics.png',
            points: [
                'Uses industry-standard engines (Nessus/Qualys).',
                'Authenticated scanning for deeper insight.',
                'Checks for over 60,000 known vulnerabilities.'
            ]
        },
        faq: [
            { question: 'Will scanning crash my server?', answer: 'Extremely unlikely. We use "safe checks" to avoid disruption.' },
            { question: 'What about web apps?', answer: 'We offer specialized Web Application Scanning (WAS) as an add-on.' }
        ],
        content: ``
    },
    'compliance-audit': {
        title: 'Compliance & Audit',
        subtitle: 'Meet Regulations',
        description: 'Consulting and tools to achieve compliance.',
        icon: 'bi bi-file-earmark-check-fill',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #64748b 100%)',
        hero_image: '/assets/images/home/history.png',
        long_description: `
            <p>Compliance is no longer just for big banks. Small businesses now face pressure to meet standards like HIPAA, GDPR, CMMC, and more. 
            Navigating these frameworks alone is expensive and confusing.</p>
            <p>BitGuard simplifies compliance. We interpret the legalese into clear technical requirements, help you implement them, 
            and generate the evidence you need to pass your audit with flying colors.</p>
        `,
        features: [
            { title: 'HIPAA / GDPR', desc: 'Specialized frameworks for healthcare and privacy data.', icon: 'bi bi-hospital' },
            { title: 'CMMC / NIST', desc: 'Readiness assessments for government contractors.', icon: 'bi bi-flag-fill' },
            { title: 'Gap Analysis', desc: 'See exactly where you fall short and how to fix it.', icon: 'bi bi-rulers' }
        ],
        benefits: [
            { title: 'Avoid Fines', description: 'Non-compliance penalties can destroy a business.', icon: 'bi bi-cash' },
            { title: 'Build Trust', description: 'Prove to your customers that you take their data seriously.', icon: 'bi bi-hand-thumbs-up-fill' },
            { title: 'Win Contracts', description: 'Many large enterprises now require vendors to be compliant.', icon: 'bi bi-file-signature' }
        ],
        process: [
            { step: '01', title: 'Assess', description: 'Interview stakeholders and review documentation.' },
            { step: '02', title: 'Implement', description: 'Deploy controls to close compliance gaps.' },
            { step: '03', title: 'Validate', description: 'Mock audit to ensure you are ready for the real thing.' }
        ],
        why_choose_us: {
            title: 'Compliance, De-Mystified',
            image: '/assets/images/home/paperwork.png',
            points: [
                'Certified auditors on staff.',
                'Automated evidence collection tools.',
                'Ongoing compliance management, not just point-in-time.'
            ]
        },
        faq: [
            { question: 'Do you issue the certification?', answer: 'We prepare you. The final certificate comes from an independent registrar.' },
            { question: 'How long does it take?', answer: 'Typically 3-6 months depending on your starting maturity.' }
        ],
        content: ``
    },

    // --- CLOUD ---
    'microsoft-365': {
        title: 'Microsoft 365 Services',
        subtitle: 'Productivity Suite',
        description: 'Expert management and migration for Office 365.',
        icon: 'bi bi-microsoft',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #0078d4 100%)',
        hero_image: '/assets/images/home/unified.jpg',
        long_description: `
            <p>Microsoft 365 is more than just Word and Excel. It's a powerhouse of productivity, communication, and security tools 
            that can transform how your business operates—if configured correctly.</p>
            <p>Our team of Microsoft Certified experts manages the complexities of M365 for you, ensuring you get the maximum ROI 
            from your subscription while keeping your data secure.</p>
        `,
        features: [
            { title: 'Seamless Migration', desc: 'Move email and files from G-Suite or Exchange without downtime or data loss.', icon: 'bi bi-arrow-right-circle-fill' },
            { title: 'Security Hardening', desc: 'Enable advanced threat protection, MFA, and data loss prevention policies.', icon: 'bi bi-shield-lock' },
            { title: 'Teams Voice', desc: 'Turn Microsoft Teams into your business phone system.', icon: 'bi bi-telephone' }
        ],
        benefits: [
            { title: 'Collaboration', description: 'Co-author documents in real-time and chat seamlessly.', icon: 'bi bi-people-fill' },
            { title: 'Mobility', description: 'Access your work from any device, anywhere, securely.', icon: 'bi bi-phone-fill' },
            { title: 'Support', description: 'Skip Microsoft\'s queue. Get direct support from our team.', icon: 'bi bi-headset' }
        ],
        process: [
            { step: '01', title: 'Assess', description: 'Review your current environment and licensing.' },
            { step: '02', title: 'Migrate', description: 'Move users and data in batches to minimize disruption.' },
            { step: '03', title: 'Adopt', description: 'Train your staff to use the new collaboration tools.' }
        ],
        why_choose_us: {
            title: 'Microsoft Gold Partners',
            image: '/assets/images/home/unified.jpg',
            points: [
                'Deep expertise in SharePoint and Teams configuration.',
                'License optimization to lower your monthly bill.',
                'Automated backup solutions for 365 data.'
            ]
        },
        faq: [
            { question: 'Will I lose my emails?', answer: 'No. We perform a full synchronization to ensure every email is transferred.' },
            { question: 'Do you sell licenses?', answer: 'Yes, often at a discount compared to buying direct.' }
        ],
        content: ``
    },
    'azure-aws': {
        title: 'Azure & AWS Solutions',
        subtitle: 'Public Cloud',
        description: 'Architecting and managing cloud infrastructure.',
        icon: 'bi bi-cloud-fill',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #f97316 100%)',
        hero_image: '/assets/images/home/api.png',
        long_description: `
            <p>The cloud offers infinite scalability, but it can also offer infinite complexity. Managing AWS or Azure environments 
            requires a specialized skillset that most SMBs don't have in-house.</p>
            <p>BitGuard designs, builds, and manages secure cloud architectures. Whether you are lifting-and-shifting legacy apps 
            or building cloud-native solutions, we ensure your infrastructure is cost-effective and rock-solid.</p>
        `,
        features: [
            { title: 'Cost Optimization', desc: 'Analyze usage patterns to right-size instances and stop overpaying.', icon: 'bi bi-cash-stack' },
            { title: 'Site Reliability', desc: 'Auto-scaling and load balancing implementation for 99.99% uptime.', icon: 'bi bi-activity' },
            { title: 'DevOps', desc: 'CI/CD pipeline setup to accelerate your software delivery.', icon: 'bi bi-infinity' }
        ],
        benefits: [
            { title: 'Agility', description: 'Spin up new resources in minutes, not weeks.', icon: 'bi bi-lightning-fill' },
            { title: 'Security', description: 'Cloud-native security controls often exceed on-premise capabilities.', icon: 'bi bi-lock-fill' },
            { title: 'Global Reach', description: 'Deploy your application to regions closer to your users.', icon: 'bi bi-globe' }
        ],
        process: [
            { step: '01', title: 'Design', description: 'Architect a solution based on the Well-Architected Framework.' },
            { step: '02', title: 'Build', description: 'Deploy infrastructure as code (Terraform/CloudFormation).' },
            { step: '03', title: 'Manage', description: 'Ongoing monitoring and specialized support.' }
        ],
        why_choose_us: {
            title: 'Cloud Certified',
            image: '/assets/images/home/server-room.png',
            points: [
                'Certified Architect-level engineers.',
                'Vendor-neutral advice (we support both AWS and Azure).',
                'proven track record of 30% average cost savings.'
            ]
        },
        faq: [
            { question: 'Which cloud is better?', answer: 'It depends on your workload. We help you choose the right fit.' },
            { question: 'Is the cloud secure?', answer: 'Yes, if configured correctly. Security is our top priority.' }
        ],
        content: ``
    },

    // --- BUSINESS PROCESS IMPROVEMENT ---
    'workflow-automation': {
        title: 'Workflow Automation',
        subtitle: 'Streamline Operations',
        description: 'Eliminate manual bottlenecks with intelligent process automation.',
        icon: 'bi bi-robot',
        hero_bg: 'linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)',
        hero_image: '/assets/images/home/unified.jpg',
        long_description: `
            <p>In today's fast-paced digital economy, manual data entry and repetitive tasks are silent killers of productivity. 
            Our Workflow Automation services leverage cutting-edge RPA (Robotic Process Automation) and API integrations to 
            connect your disparate systems and automate complex business logic.</p>
            <p>From automated invoice processing to intelligent customer onboarding flows, we design self-driving workflows 
            that reduce error rates to near zero and free up your human talent for higher-value strategic work.</p>
        `,
        features: [
            { title: 'RPA Implementation', desc: 'Deploy software bots to handle high-volume, repetitive tasks across legacy apps.', icon: 'bi bi-cpu' },
            { title: 'Integration Services', desc: 'Connect your ERP, CRM, and HR systems for seamless data flow.', icon: 'bi bi-diagram-3-fill' },
            { title: 'Custom Scripting', desc: 'Tailored Python/PowerShell solutions for unique business requirements.', icon: 'bi bi-code-square' }
        ],
        benefits: [
            { title: 'Efficiency', desc: 'Reduce process cycle times by up to 90%.', icon: 'bi bi-lightning-charge-fill' },
            { title: 'Accuracy', desc: 'Eliminate human error in data entry and calculations.', icon: 'bi bi-check-all' },
            { title: 'Scalability', desc: 'Handle 10x the workload without adding headcount.', icon: 'bi bi-graph-up-arrow' }
        ],
        process: [
            { step: '01', title: 'Map', description: 'We analyze your current manual processes and identify automation candidates.' },
            { step: '02', title: 'Build', description: 'Develop and test automation scripts in a sandbox environment.' },
            { step: '03', title: 'Deploy', description: 'Roll out automations with full monitoring and exception handling.' }
        ],
        why_choose_us: {
            title: 'Automation Architects',
            image: '/assets/images/home/ai-models.png',
            points: [
                'Certified experts in Power Automate, Zapier, and UiPath.',
                'Focus on ROI-driven implementations.',
                'Ongoing maintenance to ensure bots adapt to system updates.'
            ]
        },
        faq: [
            { question: 'Will this replace my employees?', answer: 'No, it empowers them to focus on creative and strategic tasks rather than data entry.' },
            { question: 'What if an API changes?', answer: 'Our managed automation service includes proactive monitoring and quick fixes for broken connectors.' }
        ]
    },
    'erp-consulting': {
        title: 'ERP Consulting',
        subtitle: 'Enterprise Resource Planning',
        description: 'Optimize your core business systems for maximum efficiency.',
        icon: 'bi bi-grid-1x2-fill',
        hero_bg: 'linear-gradient(135deg, #0f172a 0%, #10b981 100%)',
        hero_image: '/assets/images/home/analytics.png',
        long_description: `
            <p>An ERP system is the central nervous system of your organization. Choosing, implementing, or optimizing one 
            is a high-stakes endeavor where failure is not an option. BitGuard provides end-to-end ERP consulting services 
            to ensure your technology aligns perfectly with your operational goals.</p>
            <p>Whether you are migrating to the cloud, consolidating multiple instances, or recovering from a failed implementation, 
            our veteran consultants bring deep functional and technical expertise to guide you to success.</p>
        `,
        features: [
            { title: 'Selection Advisory', desc: 'Unbiased assistance in choosing the right ERP platform (SAP, Oracle, NetSuite, Microsoft).', icon: 'bi bi-shop-window' },
            { title: 'Implementation Rescue', desc: 'Turn around struggling projects with proven recovery methodologies.', icon: 'bi bi-life-preserver' },
            { title: 'Customization', desc: 'Tailor the platform to your unique business rules without breaking upgrade paths.', icon: 'bi bi-tools' }
        ],
        benefits: [
            { title: 'Visibility', desc: 'Real-time truth across finance, supply chain, and HR.', icon: 'bi bi-eye' },
            { title: 'Compliance', desc: 'Built-in controls for SOX, GDPR, and industry regulations.', icon: 'bi bi-shield-check' },
            { title: 'Agility', desc: 'Rapidly adapt business processes to market changes.', icon: 'bi bi-arrows-move' }
        ],
        process: [
            { step: '01', title: 'Discovery', desc: 'Deep dive into your business requirements and pain points.' },
            { step: '02', title: 'Blueprint', desc: 'Design the future state architecture and process flows.' },
            { step: '03', title: 'Execute', desc: 'Agile implementation with rigorous testing and change management.' }
        ],
        why_choose_us: {
            title: 'ERP Veterans',
            image: '/assets/images/home/server-room.png',
            points: [
                'Average of 15 years experience per consultant.',
                'Methodology agnostic (Waterfall, Agile, Hybrid).',
                'Focus on user adoption and change management.'
            ]
        },
        faq: [
            { question: 'Do you support legacy systems?', answer: 'Yes, we have expertise in maintaining and modernizing legacy mainframes and on-prem ERPs.' },
            { question: 'How long does implementation take?', answer: 'Timelines vary, but our rapid deployment methodology typically cuts standard times by 30%.' }
        ]
    },
    'digital-transformation': {
        title: 'Digital Transformation',
        subtitle: 'Future-Proof Your Business',
        description: 'Reimagine your business for the digital age.',
        icon: 'bi bi-stars',
        hero_bg: 'linear-gradient(135deg, #0f172a 0%, #8b5cf6 100%)',
        hero_image: '/assets/images/home/prompts2.png',
        long_description: `
            <p>Digital transformation is more than just moving to the cloud. It's a fundamental rethinking of how your organization 
            delivers value to customers. We help you navigate this journey by marrying business strategy with emerging technologies.</p>
            <p>From modernizing legacy applications to creating new digital revenue streams, we act as your strategic partner, 
            helping you leverage AI, Big Data, and IoT to gain a competitive edge in your market.</p>
        `,
        features: [
            { title: 'App Modernization', desc: 'Refactor monolithic legacy apps into scalable microservices architectures.', icon: 'bi bi-box-seam' },
            { title: 'Data Strategy', desc: 'Turn raw data into actionable insights with modern data warehousing and BI.', icon: 'bi bi-graph-up' },
            { title: 'Cloud Native', desc: 'Replatform workloads to fully leverage cloud elasticity and managed services.', icon: 'bi bi-cloud-plus' }
        ],
        benefits: [
            { title: 'Innovation', desc: 'Accelerate time-to-market for new products and features.', icon: 'bi bi-rocket-takeoff' },
            { title: 'Customer XP', desc: 'Deliver seamless, personalized experiences across all channels.', icon: 'bi bi-emoji-smile' },
            { title: 'Resilience', desc: 'Build systems that are robust, self-healing, and secure by design.', icon: 'bi bi-shield-fill-check' }
        ],
        process: [
            { step: '01', title: 'Assess', desc: 'Evaluate digital maturity and identify high-impact opportunities.' },
            { step: '02', title: 'Roadmap', desc: 'Prioritized execution plan balancing quick wins with long-term goals.' },
            { step: '03', title: 'Transform', desc: 'Iterative delivery of digital capabilities.' }
        ],
        why_choose_us: {
            title: 'Your Digital Guides',
            image: '/assets/images/home/video-call.png',
            points: [
                'Holistic approach covering people, process, and technology.',
                'Vendor-neutral technology selection.',
                'Proven track record across multiple industries.'
            ]
        },
        faq: [
            { question: 'Where do we start?', answer: 'We recommend starting with a Digital Maturity Assessment to benchmark your current state.' },
            { question: 'Is this just for large corps?', answer: 'No, digital transformation is critical for SMBs to remain competitive against larger rivals.' }
        ]
    },
    'process-audits': {
        title: 'Process Audits',
        subtitle: 'Operational Excellence',
        description: 'Identify inefficiencies and risk in your business workflows.',
        icon: 'bi bi-clipboard-data-fill',
        hero_bg: 'linear-gradient(135deg, #0f172a 0%, #f43f5e 100%)',
        hero_image: '/assets/images/home/paperwork.png',
        long_description: `
            <p>Efficient processes are the backbone of a profitable enterprise. Over time, ad-hoc workflows and "shadow IT" 
            can create bloat, redundancy, and hidden risks. Our Process Audit service provides a forensic examination 
            of your operations.</p>
            <p>We map your value streams, identify bottlenecks, and benchmark your performance against industry best practices. 
            The result is a clear, actionable roadmap to leaner, faster, and more compliant operations.</p>
        `,
        features: [
            { title: 'Value Stream Mapping', desc: 'Visualizing end-to-end processes to identify non-value-added activities.', icon: 'bi bi-map' },
            { title: 'Gap Analysis', desc: 'Comparing current performance against desired future state and industry benchmarks.', icon: 'bi bi-rulers' },
            { title: 'Compliance Check', desc: 'Verifying that processes adhere to regulatory and internal policy requirements.', icon: 'bi bi-check-circle' }
        ],
        benefits: [
            { title: 'Cost Reduction', desc: 'Eliminate waste and redundancy to improve the bottom line.', icon: 'bi bi-cash-stack' },
            { title: 'Risk Mitigation', desc: 'Identify and close control gaps in financial and operational processes.', icon: 'bi bi-exclamation-triangle' },
            { title: 'Standardization', desc: 'Ensure consistent quality and predictable outcomes across the organization.', icon: 'bi bi-layout-text-window-reverse' }
        ],
        process: [
            { step: '01', title: 'Interview', desc: 'Stakeholder interviews and "gemba walks" to observe work as done.' },
            { step: '02', title: 'Analyze', desc: 'Data analysis and process modeling to verify findings.' },
            { step: '03', title: 'Report', desc: 'Detailed findings and prioritized recommendations for improvement.' }
        ],
        why_choose_us: {
            title: 'Detail Oriented',
            image: '/assets/images/home/history.png',
            points: [
                'Certified Six Sigma Black Belts.',
                'Data-driven approach utilizing process mining tools.',
                'Focus on actionable, practical recommendations.'
            ]
        },
        faq: [
            { question: 'How disruptive is the audit?', answer: 'We minimize disruption by reviewing documentation and data first, then conducting targeted interviews.' },
            { question: 'What do we get at the end?', answer: 'A comprehensive report detailing current state, issues, risks, and a roadmap for remediation.' }
        ]
    },

    // --- CO-MANAGED IT ---
    'staff-augmentation': {
        title: 'IT Staff Augmentation',
        subtitle: 'Scale Your Team',
        description: 'Add skilled operational talent to your team on demand.',
        icon: 'bi bi-people-fill',
        hero_bg: 'linear-gradient(135deg, #0f172a 0%, #06b6d4 100%)',
        hero_image: '/assets/images/people/women1.jpg',
        long_description: `
            <p>Finding and retaining top IT talent is harder than ever. Staff Augmentation allows you to instantly scale your 
            technical workforce without the overhead of recruiting, hiring, and training. Access a global pool of 
            pre-vetted engineers, developers, and support specialists.</p>
            <p>These resources integrate directly into your team, attending your stand-ups and using your tools, 
            working under your management while we handle payroll, benefits, and HR.</p>
        `,
        features: [
            { title: 'Tier 1-3 Support', desc: 'Plug gaps in your helpdesk with certified support technicians.', icon: 'bi bi-headset' },
            { title: 'Specialized Skills', desc: 'Access niche expertise (e.g., DevOps, Cybersecurity, Database Admin) on demand.', icon: 'bi bi-stars' },
            { title: 'Flexible Terms', desc: 'Scale up for a project and scale down when it completes. No long-term lock-in.', icon: 'bi bi-arrows-expand' }
        ],
        benefits: [
            { title: 'Speed', desc: 'Have a qualified engineer ready to start within 48-72 hours.', icon: 'bi bi-stopwatch' },
            { title: 'Cost Efficiency', desc: 'Save 30-50% compared to the carrying cost of a full-time employee.', icon: 'bi bi-briefcase' },
            { title: 'Focus', desc: 'Let your internal core team focus on strategy while augmented staff handle operations.', icon: 'bi bi-bullseye' }
        ],
        process: [
            { step: '01', title: 'Define', desc: 'We work with you to define the exact skill set and cultural fit required.' },
            { step: '02', title: 'Select', desc: 'We present candidates from our vetted pool for your interview and approval.' },
            { step: '03', title: 'Onboard', desc: 'Structured handover to ensure productivity from Day 1.' }
        ],
        why_choose_us: {
            title: 'Top 1% Talent',
            image: '/assets/images/people/man2.jpg',
            points: [
                'Rigorous technical and soft-skill vetting process.',
                'Dedicated account manager to ensure resource performance.',
                'Replacement guarantee if a resource is not the right fit.'
            ]
        },
        faq: [
            { question: 'Are they your employees?', answer: 'Yes, they are full-time BitGuard employees assigned to your account.' },
            { question: 'Can we hire them directly?', answer: 'We offer contract-to-hire options if you decide you want to keep a resource permanently.' }
        ]
    },
    'specialized-projects': {
        title: 'Specialized Project Support',
        subtitle: 'Project Execution',
        description: 'Expert teams to deliver complex IT projects on time and budget.',
        icon: 'bi bi-kanban-fill',
        hero_bg: 'linear-gradient(135deg, #0f172a 0%, #6366f1 100%)',
        hero_image: '/assets/images/home/scrum-board.png',
        long_description: `
            <p>Internal IT teams are often consumed by "keeping the lights on," leaving critical upgrades and migrations 
            on the back burner. Our Project Support service deploys a "SWAT team" of experts to execute specific, 
            high-value initiatives without distracting your core staff.</p>
            <p>From server migrations and network overhauls to complex cloud deployments, we bring the tools, methodology, 
            and manpower to deliver professional results with minimal disruption.</p>
        `,
        features: [
            { title: 'Migration Services', desc: 'Risk-free movement of workloads to Cloud, Hybrid, or new Hardware.', icon: 'bi bi-box-seam' },
            { title: 'Network Design', desc: 'Architecture and deployment of high-performance wired/wireless networks.', icon: 'bi bi-router' },
            { title: 'Security Rollouts', desc: 'Rapid deployment of MFA, EDR, or DLP across large user bases.', icon: 'bi bi-shield-check' }
        ],
        benefits: [
            { title: 'On Time', desc: 'We utilize dedicated project managers to ensure milestones are met.', icon: 'bi bi-calendar-check' },
            { title: 'On Budget', desc: 'Fixed-price scopes available for predictable project costs.', icon: 'bi bi-cash' },
            { title: 'Knowledge Transfer', desc: 'We document everything and train your team before handover.', icon: 'bi bi-book' }
        ],
        process: [
            { step: '01', title: 'Scope', desc: 'Detailed requirements gathering and scope of work definition.' },
            { step: '02', title: 'Execute', desc: 'Technical implementation following industry best practices.' },
            { step: '03', title: 'Closeout', desc: 'Validation, documentation, and formal sign-off.' }
        ],
        why_choose_us: {
            title: 'Project Precision',
            image: '/assets/images/home/unified.jpg',
            points: [
                'PMP certified Project Managers.',
                'Proven methodologies refined over hundreds of successful projects.',
                'Post-project warranty period included.'
            ]
        },
        faq: [
            { question: 'How do you handle scope creep?', answer: 'We have a formal change management process to handle requirements changes transparently.' },
            { question: 'What if things break?', answer: 'We schedule major cutovers for off-hours and always include rollback plans.' }
        ]
    },
    'hybrid-support': {
        title: 'Hybrid Support Model',
        subtitle: 'Best of Both Worlds',
        description: 'Collaborative IT support combining internal presence with external scale.',
        icon: 'bi bi-diagram-2-fill',
        hero_bg: 'linear-gradient(135deg, #0f172a 0%, #a855f7 100%)',
        hero_image: '/assets/images/home/server-rack.png',
        long_description: `
            <p>The Hybrid Support model helps internal IT departments that are overwhelmed or lack specific tools. 
            We act as a force multiplier for your team. You keep control of the strategy and on-site relationships, 
            while we handle the backend, monitoring, and overflow helpdesk tickets.</p>
            <p>We share our sophisticated ticketing system, documentation platform, and monitoring tools with your team, 
            giving them enterprise-grade capabilities instantly.</p>
        `,
        features: [
            { title: 'Shared Ticketing', desc: 'Co-work tickets in a unified portal. Route simple issues to us, keep complex ones.', icon: 'bi bi-ticket-perforated' },
            { title: 'Tool Licensing', desc: 'Gain access to RMM, Documentation, and Security tools without buying your own.', icon: 'bi bi-tools' },
            { title: 'Escalation Point', desc: 'Your team has a direct line to our Tier 3 engineers for tough problems.', icon: 'bi bi-ladder' }
        ],
        benefits: [
            { title: 'Burnout Prevention', desc: 'We take the after-hours and weekend shifts so your team can rest.', icon: 'bi bi-heart-pulse' },
            { title: 'Capabilities', desc: 'Instantly add 24/7 SOC and NOC capabilities to your department.', icon: 'bi bi-building-add' },
            { title: 'Control', desc: 'You remain the face of IT to your company; we support you from behind the scenes.', icon: 'bi bi-person-badge' }
        ],
        process: [
            { step: '01', title: 'Integrate', desc: 'Connect our tools and processes with yours.' },
            { step: '02', title: 'Define', desc: 'Establish clear "Rules of Engagement" for ticket routing.' },
            { step: '03', title: 'Partner', desc: 'Regular strategy calls to align our support with your goals.' }
        ],
        why_choose_us: {
            title: 'True Partners',
            image: '/assets/images/home/people-working.png',
            points: [
                'We don\'t try to replace your team; we make them look like rockstars.',
                'Flexible agreements that can evolve as your needs change.',
                'Full transparency and shared documentation.'
            ]
        },
        faq: [
            { question: 'Who handles user onboarding?', answer: 'We can handle the technical setup while you handle the physical equipment and welcome.' },
            { question: 'Can we use your tools?', answer: 'Yes, we provision seats for your internal IT staff in our management portals.' }
        ]
    },
    'consulting': {
        title: 'Strategic IT Consulting',
        subtitle: 'Leadership & Vision',
        description: 'Fractional CIO services to align technology with business strategy.',
        icon: 'bi bi-lightbulb-fill',
        hero_bg: 'linear-gradient(135deg, #0f172a 0%, #e11d48 100%)',
        hero_image: '/assets/images/people/women1.jpg',
        long_description: `
            <p>Technology should drive business growth, not just be a cost center. Many organizations lack the 
            executive-level technology leadership required to bridge the gap between business goals and IT execution. 
            Our Strategic Consulting services provide that leadership.</p>
            <p>We help you budget, plan, and execute a technology roadmap that supports your 1, 3, and 5-year business objectives, 
            ensuring every dollar spent on IT delivers a measurable return.</p>
        `,
        features: [
            { title: 'vCIO Services', desc: 'Virtual Chief Information Officer participation in your board meetings.', icon: 'bi bi-person-video2' },
            { title: 'Budgeting', desc: 'Detailed CAPEX/OPEX planning to eliminate surprise IT expenses.', icon: 'bi bi-calculator' },
            { title: 'Vendor Management', desc: 'We haggle with ISPs and software vendors so you don\'t have to.', icon: 'bi bi-shop' }
        ],
        benefits: [
            { title: 'Alignment', desc: 'Ensure IT initiatives directly support revenue and efficiency goals.', icon: 'bi bi-arrows-angle-contract' },
            { title: 'Risk Reduction', desc: 'Identify single points of failure and business continuity risks.', icon: 'bi bi-shield-exclamation' },
            { title: 'Maturity', desc: 'Move your IT operations from chaotic to optimized.', icon: 'bi bi-ladder' }
        ],
        process: [
            { step: '01', title: 'Review', desc: 'Holistic review of business goals and current tech stack.' },
            { step: '02', title: 'Plan', desc: 'Develop a strategic roadmap with quarterly milestones.' },
            { step: '03', title: 'Guide', desc: 'Quarterly Business Reviews (QBRs) to track progress and adjust course.' }
        ],
        why_choose_us: {
            title: 'Business First',
            image: '/assets/images/home/analytics.png',
            points: [
                'Consultants with MBA and technical backgrounds.',
                'Vendor agnostic advice focused on your best interest.',
                'Proven frameworks for IT maturity and governance.'
            ]
        },
        faq: [
            { question: 'How often do we meet?', answer: 'Typically monthly for status and quarterly for strategic planning.' },
            { question: 'Do you help with hiring?', answer: 'Yes, we can assist in writing job descriptions and interviewing for internal IT roles.' }
        ]
    },
    'cloud-storage': {
        title: 'Cloud Storage',
        subtitle: 'Secure File Share',
        description: 'Enterprise-grade file storage and syncing.',
        icon: 'bi bi-hdd-network-fill',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #22c55e 100%)',
        hero_image: '/assets/images/home/import.png',
        long_description: `
            <p>The VPN is dying. In a distributed world, your team needs access to files securely from anywhere, without the friction of 
            clunky VPN connections. Modern cloud storage combines the familiarity of a file server with the flexibility of the cloud.</p>
            <p>We implement solutions like Egnyte, Dropbox Business, or SharePoint that offer file locking, granular permissions, 
            and blazing fast access speeds.</p>
        `,
        features: [
            { title: 'Encryption', desc: 'Bank-grade encryption for data at rest and in transit.', icon: 'bi bi-safe2-fill' },
            { title: 'File Recovery', desc: 'Accidentally deleted a folder? Restore it yourself in seconds.', icon: 'bi bi-recycle' },
            { title: 'Granular Permissions', desc: 'Control exactly which folders each user or group can see.', icon: 'bi bi-people-fill' }
        ],
        benefits: [
            { title: 'No Hardware', description: 'Retire that noisy, hot server in your closet.', icon: 'bi bi-plug-fill' },
            { title: 'Collaboration', description: 'Stop emailing attachments. Share secure links instead.', icon: 'bi bi-share-fill' },
            { title: 'Mobile Ready', description: 'Access everything from your phone or tablet.', icon: 'bi bi-phone' }
        ],
        process: [
            { step: '01', title: 'Structure', description: 'Design a logical folder hierarchy.' },
            { step: '02', title: 'Migrate', description: 'Upload terabytes of data over weekends.' },
            { step: '03', title: 'Map', description: 'Map drives on user computers for a seamless experience.' }
        ],
        why_choose_us: {
            title: 'Data Sovereignty',
            image: '/assets/images/home/import.png',
            points: [
                'Keep data within specific geographic regions if required.',
                'Hybrid options available for large video/CAD files.',
                'Ransomware detection built-in.'
            ]
        },
        faq: [
            { question: 'Is it fast enough for large files?', answer: 'For large files, we recommend a hybrid solution with a local cache.' },
            { question: 'Who owns the data?', answer: 'You do. Always.' }
        ],
        content: ``
    },

    // --- DIGITAL ---
    'web-design': {
        title: 'Web Design & Development',
        subtitle: 'Digital Experience',
        description: 'Stunning websites that convert visitors into customers.',
        icon: 'bi bi-laptop',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #d946ef 100%)',
        hero_image: '/assets/images/home/websearch.png',
        long_description: `
            <p>Your website is your 24/7 salesperson. If it's slow, ugly, or confusing, you are losing money. 
            BitGuard Digital builds high-performance websites that blend beautiful aesthetics with psychological conversion triggers.</p>
            <p>We don't just use templates. We design custom digital experiences that tell your brand story and guide visitors 
            effortlessly toward making a purchase or booking a call.</p>
        `,
        features: [
            { title: 'Responsive Design', desc: 'Pixel-perfect rendering on phones, tablets, and 4k desktops.', icon: 'bi bi-phone' },
            { title: 'SEO Optimized', desc: 'Built from the ground up to rank high on Google.', icon: 'bi bi-google' },
            { title: 'Speed Optimization', desc: 'Load times under 2 seconds to keep users engaged.', icon: 'bi bi-speedometer' }
        ],
        benefits: [
            { title: 'More Leads', description: 'Conversion-focused layout drives user action.', icon: 'bi bi-funnel-fill' },
            { title: 'Brand Authority', description: 'Look like the industry leader you are.', icon: 'bi bi-award-fill' },
            { title: 'Easy Management', description: 'Update content yourself with an easy-to-use CMS.', icon: 'bi bi-pencil-square' }
        ],
        process: [
            { step: '01', title: 'Discovery', description: 'Understand your audience and goals.' },
            { step: '02', title: 'Design', description: 'Create high-fidelity mockups for approval.' },
            { step: '03', title: 'Develop', description: 'Code the site and launch it to the world.' }
        ],
        why_choose_us: {
            title: 'Performance Obsessed',
            image: '/assets/images/home/websearch.png',
            points: [
                'We score 90+ on Google PageSpeed Insights.',
                'Accessible designs (WCAG compliant) standard.',
                'Hosting and maintenance included.'
            ]
        },
        faq: [
            { question: 'How much does a website cost?', answer: 'Projects typically range from $3k to $15k depending on complexity.' },
            { question: 'Do you write the content?', answer: 'We have copywriters on staff to help tell your story.' }
        ],
        content: ``
    },
    'design-services': {
        title: 'Design Services',
        subtitle: 'Brand Identity',
        description: 'Logo design, branding, and marketing assets.',
        icon: 'bi bi-brush-fill',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #ec4899 100%)',
        hero_image: '/assets/images/home/prompts2.png',
        long_description: `
            <p>A brand is more than a logo. It's a feeling. It's the promise you make to your customers. 
            Our design team helps you define that promise visually.</p>
            <p>From complete brand overhauls to sales decks, social media graphics, and print collateral, we ensure your brand 
            looks consistent and professional across every touchpoint.</p>
        `,
        features: [
            { title: 'Identity Systems', desc: 'Logos, color palettes, and typography guidelines.', icon: 'bi bi-palette-fill' },
            { title: 'UI/UX Design', desc: 'Wireframes and prototypes for apps and software.', icon: 'bi bi-layout-text-window-reverse' },
            { title: 'Marketing Assets', desc: 'Brochures, business cards, and digital ad creative.', icon: 'bi bi-images' }
        ],
        benefits: [
            { title: 'Recognition', description: 'Stand out in a crowded market.', icon: 'bi bi-eye' },
            { title: 'Consistency', description: 'Build trust with a coherent visual language.', icon: 'bi bi-grid-1x2-fill' },
            { title: 'Professionalism', description: 'Show clients you pay attention to detail.', icon: 'bi bi-briefcase-fill' }
        ],
        process: [
            { step: '01', title: 'Brief', description: 'We ask deep questions to understand your vibe.' },
            { step: '02', title: 'Concepts', description: 'We present 3 distinct visual directions.' },
            { step: '03', title: 'Refine', description: 'Polish the chosen direction until its perfect.' }
        ],
        why_choose_us: {
            title: 'Visual Storytellers',
            image: '/assets/images/home/prompts2.png',
            points: [
                'Unlimited revisions on concept phase.',
                'Delivery of all source files (AI, PSD, EPS).',
                'Fast turnaround times.'
            ]
        },
        faq: [
            { question: 'What if I don\'t like the designs?', answer: 'We keep iterating until you do. Satisfaction guaranteed.' },
            { question: 'Do you print?', answer: 'We design for print and can coordinate with print shops for you.' }
        ],
        content: ``
    },
    'full-stack': {
        title: 'Full Stack Development',
        subtitle: 'Custom Software',
        description: 'End-to-end development of complex web applications.',
        icon: 'bi bi-code-slash',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #8b5cf6 100%)',
        hero_image: '/assets/images/home/api.png',
        long_description: `
            <p>Generic software rarely fits unique business problems. When off-the-shelf solutions fall short, we build custom. 
            Our full-stack engineers create robust, scalable web applications tailored to your exact workflows.</p>
            <p>Whether it's a customer portal, an internal inventory system, or a SaaS product, we handle the entire stack—database, 
            backend logic, and frontend interface—to deliver a seamless solution.</p>
        `,
        features: [
            { title: 'Modern Stack', desc: 'Built with React, Node.js, Python, and PostgreSQL.', icon: 'bi bi-stack' },
            { title: 'API Integration', desc: 'Connect your new app with your existing tools (Salesforce, QuickBooks, etc.).', icon: 'bi bi-plug' },
            { title: 'Scalable Architecture', desc: 'Cloud-native design that grows with your user base.', icon: 'bi bi-cloud-plus' }
        ],
        benefits: [
            { title: 'Efficiency', description: 'Automate manual processes unique to your business.', icon: 'bi bi-gear-wide-connected' },
            { title: 'Ownership', description: 'You own the code and the IP. No recurring license fees.', icon: 'bi bi-file-earmark-code' },
            { title: 'Competitive Advantage', description: 'Do things your competitors can\'t.', icon: 'bi bi-trophy' }
        ],
        process: [
            { step: '01', title: 'Spec', description: 'Write detailed user stories and requirements.' },
            { step: '02', title: 'Sprint', description: 'Agile development with bi-weekly demos.' },
            { step: '03', title: 'Launch', description: 'Deploy, train users, and support.' }
        ],
        why_choose_us: {
            title: 'Engineering Excellence',
            image: '/assets/images/home/api.png',
            points: [
                'Rigorous code reviews and automated testing.',
                'Security-first development lifecycle (DevSecOps).',
                'Documentation that actually makes sense.'
            ]
        },
        faq: [
            { question: 'Who hosts the app?', answer: 'We can host it for you or deploy it to your AWS/Azure account.' },
            { question: 'Do you support it after launch?', answer: 'Yes, we offer ongoing maintenance packages.' }
        ],
        content: ``
    },
    'app-development': {
        title: 'Application Development',
        subtitle: 'Mobile & Web',
        description: 'Native and cross-platform mobile apps.',
        icon: 'bi bi-phone-fill',
        hero_bg: 'linear-gradient(135deg, #034484 0%, #3b82f6 100%)',
        hero_image: '/assets/images/home/text-to-image.png',
        long_description: `
            <p>Put your business in your customer's pocket. Mobile apps offer unparalleled engagement and functionality. 
            We build beautiful, intuitive mobile experiences for iOS and Android.</p>
            <p>Using cross-platform technologies like React Native and Flutter, we deliver native performance on both platforms 
            with a single codebase, saving you time and money.</p>
        `,
        features: [
            { title: 'iOS & Android', desc: 'Publish to both the App Store and Google Play.', icon: 'bi bi-apple' },
            { title: 'Offline Mode', desc: 'Apps work even when the connection drops.', icon: 'bi bi-wifi-off' },
            { title: 'Push Notifications', desc: 'Re-engage users with timely alerts.', icon: 'bi bi-bell' }
        ],
        benefits: [
            { title: 'Engagement', description: 'Apps have 3x higher conversion rates than mobile websites.', icon: 'bi bi-bar-chart-line' },
            { title: 'Features', description: 'Access camera, GPS, and contacts for rich functionality.', icon: 'bi bi-phone-vibrate' },
            { title: 'Loyalty', description: 'Stay top-of-mind with an icon on their home screen.', icon: 'bi bi-heart' }
        ],
        process: [
            { step: '01', title: 'Prototype', description: 'Clickable mockup to test the flow.' },
            { step: '02', title: 'Build', description: 'Development and internal testing.' },
            { step: '03', title: 'Submit', description: 'We handle the complex App Store review process.' }
        ],
        why_choose_us: {
            title: '5-Star Experiences',
            image: '/assets/images/home/text-to-image.png',
            points: [
                'Expertise in React Native and Flutter.',
                'Focus on smooth 60fps animations.',
                'Crash analytics and performance monitoring included.'
            ]
        },
        faq: [
            { question: 'How long does it take?', answer: 'An MVP typically takes 3-4 months.' },
            { question: 'Do you take a percentage of sales?', answer: 'No. You keep 100% of your revenue (minus Apple/Google fees).' }
        ],
        content: ``
    },
    'co-managed-it': {
        title: 'Co-Managed IT Services',
        subtitle: 'Extending Your Internal Team',
        description: 'Partner with us to fill skill gaps, handle routine maintenance, and scale your IT capabilities without hiring more staff.',
        icon: 'bi bi-people-fill',
        hero_bg: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        hero_image: '/assets/images/home/unified.jpg',
        long_description: `
            <p>Your internal IT team is your greatest asset, but they can't do it all. Between managing daily tickets, putting out fires, and driving strategic projects, 
            burnout is a real risk. Co-Managed IT (Co-MIT) bridges the gap.</p>
            <p>We don't replace your team; we empower them. Whether you need Level 1 helpdesk support to free up your engineers, or high-level security expertise 
            for a specific project, BitGuard acts as a seamless extension of your workforce.</p>
        `,
        features: [
            { title: 'Shared Ticketing', desc: 'Collaborate in real-time on our unified service desk platform.', icon: 'bi bi-ticket-detailed-fill' },
            { title: 'Specialized Expertise', desc: 'Access certified experts in cybersecurity, cloud, and compliance on demand.', icon: 'bi bi-award-fill' },
            { title: 'Vacation Coverage', desc: 'Ensure your business never stops, even when your IT staff takes a break.', icon: 'bi bi-sun-fill' }
        ],
        benefits: [
            { title: 'Eliminate Burnout', description: 'Offload routine tasks so your team can focus on high-value initiatives.', icon: 'bi bi-battery-charging' },
            { title: 'Cost Effective', description: 'Get a full team of experts for less than the cost of one new hire.', icon: 'bi bi-cash-coin' },
            { title: 'Scalability', description: 'Scale support up or down instantly based on your business needs.', icon: 'bi bi-graph-up-arrow' }
        ],
        process: [
            { step: '01', title: 'Assess', description: 'We identify your team\'s strengths and where you need help.' },
            { step: '02', title: 'Integrate', description: 'We connect our tools and processes with yours.' },
            { step: '03', title: 'Support', description: 'We begin handling agreed-upon workflows immediately.' }
        ],
        why_choose_us: {
            title: 'The Perfect Partner',
            image: '/assets/images/home/tech-team.jpg',
            points: [
                'No long-term lock-in contracts.',
                'Full transparency with shared dashboards.',
                'We adapt to your tools, not the other way around.'
            ]
        },
        faq: [
            { question: 'Will you replace my IT Lead?', answer: 'Never. We report to your IT leadership and support their goals.' },
            { question: 'How do we request help?', answer: 'Through a shared Slack channel, portal, or phone line - whatever works for you.' }
        ],
        content: ``
    },
    'business-process-improvement': {
        title: 'Business Process Improvement',
        subtitle: 'Automate. Optimize. Scale.',
        description: 'Streamline your operations with intelligent automation and workflow optimization.',
        icon: 'bi bi-arrow-repeat',
        hero_bg: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
        hero_image: '/assets/images/home/analytics.png',
        long_description: `
            <p>Inefficient processes are the silent killer of profitability. Manual data entry, disconnected systems, and repetitive tasks 
            slow down your team and introduce errors. We use technology to redesign how you work.</p>
            <p>From automating invoice processing to integrating your CRM and ERP, we build digital workflows that save time and reduce costs. 
            Stop working harder and start working smarter.</p>
        `,
        features: [
            { title: 'Workflow Automation', desc: 'Replace manual tasks with intelligent, automated scripts.', icon: 'bi bi-robot' },
            { title: 'System Integration', desc: 'Connect your disparate software tools into a unified ecosystem.', icon: 'bi bi-link-45deg' },
            { title: 'Data Analytics', desc: 'Turn operational data into actionable business insights.', icon: 'bi bi-bar-chart-fill' }
        ],
        benefits: [
            { title: 'Increase Speed', description: 'Accelerate cycle times for core business processes by 50% or more.', icon: 'bi bi-stopwatch' },
            { title: 'Reduce Error', description: 'Eliminate human error in data entry and calculations.', icon: 'bi bi-shield-check' },
            { title: 'Better CX', description: 'Deliver faster, more consistent service to your customers.', icon: 'bi bi-emoji-smile-fill' }
        ],
        process: [
            { step: '01', title: 'Map', description: 'We map your current processes end-to-end.' },
            { step: '02', title: 'Analyze', description: 'We identify bottlenecks and waste.' },
            { step: '03', title: 'Design', description: 'We engineer a new, optimized future state.' },
            { step: '04', title: 'Automate', description: 'We build and deploy the technology solutions.' }
        ],
        why_choose_us: {
            title: 'Results You Can Measure',
            image: '/assets/images/home/search.png',
            points: [
                'ROI-focused approach with clear metrics.',
                'Expertise in LogicApps, Power Automate, and custom Python.',
                'Minimal disruption during implementation.'
            ]
        },
        faq: [
            { question: 'How long does an assessment take?', answer: 'Typically 1-2 weeks depending on organizational complexity.' },
            { question: 'Is this just for large companies?', answer: 'No, small businesses often see the biggest gains from automation.' }
        ],
        faq: [
            { question: 'How long does an assessment take?', answer: 'Typically 1-2 weeks depending on organizational complexity.' },
            { question: 'Is this just for large companies?', answer: 'No, small businesses often see the biggest gains from automation.' }
        ],
        content: ``
    },
    'premium-addons': {
        title: 'Premium Service Add-ons',
        subtitle: 'Enhance Your Platform',
        description: 'Unlock advanced capabilities, dedicated support, and white-label options for your BitGuard experience.',
        icon: 'bi bi-gem',
        hero_bg: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
        hero_image: '/assets/images/home/unified.jpg',
        long_description: `
             <p>BitGuard's core platform is powerful, but some organizations need more. Our Premium Add-ons allow you to tailor your service 
             level to meet specific business requirements.</p>
             <p>Whether you need guaranteed 15-minute response times, white-label reporting for your own clients, or specialized compliance 
             monitoring, our add-on marketplace allows you to scale your capabilities effortlessly.</p>
        `,
        features: [
            { title: 'Dedicated Support', desc: 'Direct access to a named Technical Account Manager and 24/7 priority routing.', icon: 'bi bi-headset' },
            { title: 'Advanced Reporting', desc: 'Custom BI dashboards, SQL access to your data, and automated executive summaries.', icon: 'bi bi-bar-chart-lines-fill' },
            { title: 'White Labeling', desc: 'Rebrand our client portal with your logo and colors for a seamless customer experience.', icon: 'bi bi-palette-fill' }
        ],
        benefits: [
            { title: 'Priority Access', description: 'Skip the queue. Your critical issues go straight to Tier 3 engineers.', icon: 'bi bi-lightning-charge-fill' },
            { title: 'Brand Equity', description: 'Present a polished, professional image to your stakeholders with custom branding.', icon: 'bi bi-briefcase-fill' },
            { title: 'Deep Insights', description: 'Make data-driven decisions with granular analytics and export capabilities.', icon: 'bi bi-search' }
        ],
        process: [
            { step: '01', title: 'Browse', description: 'Explore available add-ons in your service portal.' },
            { step: '02', title: 'Activate', description: 'One-click provisioning adds functionality instantly.' },
            { step: '03', title: 'Configure', description: 'Customize settings to match your specific workflows.' }
        ],
        why_choose_us: {
            title: 'Flexible & Scalable',
            image: '/assets/images/home/security-ops.jpg',
            points: [
                'Pay only for what you need.',
                'Monthly terms with no long-term commitment.',
                'Seamless integration with your existing instance.'
            ]
        },
        faq: [
            { question: 'Can I cancel add-ons anytime?', answer: 'Yes, add-ons are billed monthly and can be cancelled at any time.' },
            { question: 'Is White Labeling included in Pro?', answer: 'No, White Labeling is an exclusive Premium Add-on.' }
        ],
        content: ``
    },
};

export default SERVICES;
