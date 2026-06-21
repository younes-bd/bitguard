import os

base_dir = r"C:\Users\youne\Desktop\2-InfoTech\website\website13\frontend\src\apps\marketing\pages"

components = {
    "campaigns": ["CampaignList", "EmailCampaigns", "SocialCampaigns", "SmsCampaigns"],
    "content": ["ContentCalendar", "ContentLibrary", "PostDrafts", "ApprovalWorkflow"],
    "ai": ["PostGeneration", "BlogGeneration", "TranslationRewriting"],
    "assets": ["AssetList", "BrandKit", "TemplatesList"],
    "social": ["Scheduler", "PublishingQueue", "EngagementMonitor"],
    "video": ["AiVideoGeneration", "ShortsReels"],
    "analytics": ["AnalyticsDashboard", "AudienceGrowth"],
    "config": ["AutomationsList", "MarketingIntegrations", "MarketingSettings"]
}

template = """import React from 'react';

const {name} = () => {{
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{name}</h1>
            <p className="mt-4 text-slate-500 dark:text-slate-400">This module is part of the expanded Marketing Automation suite. Integration pending.</p>
        </div>
    );
}};

export default {name};
"""

for folder, files in components.items():
    folder_path = os.path.join(base_dir, folder)
    os.makedirs(folder_path, exist_ok=True)
    for file in files:
        file_path = os.path.join(folder_path, f"{file}.jsx")
        if not os.path.exists(file_path):
            with open(file_path, "w") as f:
                f.write(template.format(name=file))

print("Successfully generated all placeholder components.")
