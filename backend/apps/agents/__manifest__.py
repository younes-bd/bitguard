{
    'name': 'Agents',
    'technical_name': 'agents',
    'version': '1.0',
    'author': 'BitGuard',
    'website': 'https://bitguard.io',
    'license': 'LGPL-3',
    'category': 'Administration',
    'display_name': 'Agents',
    'summary': 'Build and manage AI-powered virtual agents for automation and intelligent workflows.',
    'description': (
        'The Agents module lets you create, configure, and monitor '
        'AI virtual agents powered by the BitGuard AI Engine. '
        'Agents automate tasks, respond to ERP events, and act as '
        'intelligent assistants across the platform.'
    ),
    'icon': 'Bot',
    'url': '/admin/agents',
    'depends': ['ai_engine', 'system', 'automation'],
    'installable': True,
    'application': True,
    'featured': True,
    'screenshots': [],
    'command_center_section': 'Administration',
    'sequence': 1050,
    'has_settings': True,
    'settings_url': '/admin/settings/ai_engine',
    'settings_desc': 'Configure AI provider keys and agent execution limits',
    'ui_paradigm': 'Primary Application (Has Dashboard/Command Center Tile)',
    'navigation_path': 'Command Center → Administration → Agents Tile',
}
