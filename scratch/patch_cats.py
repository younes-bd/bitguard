import re

with open('frontend/src/apps/system/pages/dashboards/SettingsDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('const getSettingsCategories = (isDevMode) => [', 'const getSettingsCategories = (isDevMode, t) => [')
content = content.replace(" label: General
