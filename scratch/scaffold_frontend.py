import os

apps = [
    {'tech': 'amazon', 'name': 'Amazon Connector', 'cat': 'Sales', 'seq': 6},
    {'tech': 'shop_floor', 'name': 'Shop Floor', 'cat': 'Manufacturing', 'seq': 2},
    {'tech': 'frontdesk', 'name': 'Frontdesk', 'cat': 'Human Resources', 'seq': 5},
    {'tech': 'todo', 'name': 'To-Do', 'cat': 'Productivity', 'seq': 2},
]

FRONTEND = '/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/frontend/src/apps'

def camel_case(s):
    return ''.join(word.title() for word in s.split('_'))

for app in apps:
    tech = app['tech']
    name = app['name']
    cat = app['cat']
    seq = app['seq']
    cc_name = camel_case(tech)
    
    app_dir = os.path.join(FRONTEND, tech)
    os.makedirs(os.path.join(app_dir, 'config'), exist_ok=True)
    os.makedirs(os.path.join(app_dir, 'routes'), exist_ok=True)
    os.makedirs(os.path.join(app_dir, 'pages', 'dashboards'), exist_ok=True)
    
    # 1. menu.js
    menu_content = f'''import {{ LayoutDashboard, Settings }} from 'lucide-react';

export const {tech}Manifest = {{
    techName: '{tech}',
    displayName: '{name}',
    commandCenterSection: '{cat}',
    commandCenterOrder: {seq},
    hasSettings: false,
    settingsUrl: null,
    settingsDesc: null,
}};

export const {tech}Menu = [
    {{
        title: '{name}',
        items: [
            {{ label: 'Dashboard', icon: LayoutDashboard, path: '/admin/{tech}' }}
        ]
    }}
];
'''
    with open(os.path.join(app_dir, 'config', 'menu.js'), 'w') as f:
        f.write(menu_content)
        
    # 2. Dashboard
    dash_content = f'''import React from 'react';
import {{ LayoutDashboard }} from 'lucide-react';

const {cc_name}Dashboard = () => {{
    return (
        <div className=" p-6 space-y-6>
