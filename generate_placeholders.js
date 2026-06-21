const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'frontend', 'src', 'apps', 'marketing', 'pages');

const components = {
    "campaigns": ["CampaignList", "EmailCampaigns", "SocialCampaigns", "SmsCampaigns"],
    "content": ["ContentCalendar", "ContentLibrary", "PostDrafts", "ApprovalWorkflow"],
    "ai": ["PostGeneration", "BlogGeneration", "TranslationRewriting"],
    "assets": ["AssetList", "BrandKit", "TemplatesList"],
    "social": ["Scheduler", "PublishingQueue", "EngagementMonitor"],
    "video": ["AiVideoGeneration", "ShortsReels"],
    "analytics": ["AnalyticsDashboard", "AudienceGrowth"],
    "config": ["AutomationsList", "MarketingIntegrations", "MarketingSettings"]
};

const template = (name) => `import React from 'react';

const ${name} = () => {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">${name}</h1>
            <p className="mt-4 text-slate-500 dark:text-slate-400">This module is part of the expanded Marketing Automation suite. Integration pending.</p>
        </div>
    );
};

export default ${name};
`;

Object.entries(components).forEach(([folder, files]) => {
    const folderPath = path.join(baseDir, folder);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    
    files.forEach(file => {
        const filePath = path.join(folderPath, `${file}.jsx`);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, template(file));
            console.log(`Created ${filePath}`);
        }
    });
});

console.log("Successfully generated all placeholder components.");
