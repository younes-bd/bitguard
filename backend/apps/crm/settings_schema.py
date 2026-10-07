SETTINGS_SCHEMA = {
    'crm.lead_scoring': {
        'type': 'boolean',
        'default': 'false',
        'label': 'Lead Scoring',
        'help': 'Automatically score incoming leads based on activity and engagement.',
        'group': 'Lead Generation'
    },
    'crm.auto_assign': {
        'type': 'boolean',
        'default': 'false',
        'label': 'Auto-Assign Leads',
        'help': 'Automatically assign new leads to the least loaded salesperson.',
        'group': 'Lead Generation'
    },
    'crm.pipeline_stages': {
        'type': 'boolean',
        'default': 'true',
        'label': 'Custom Pipeline Stages',
        'help': 'Allow custom pipeline stage configuration per sales team.',
        'group': 'Pipeline Management'
    },
    'crm.email_alias': {
        'type': 'boolean',
        'default': 'false',
        'label': 'Email Alias for Leads',
        'help': 'Create leads automatically from incoming emails.',
        'group': 'Lead Generation'
    },
    'crm.activity_reminders': {
        'type': 'boolean',
        'default': 'true',
        'label': 'Activity Reminders',
        'help': 'Send scheduled reminders for overdue CRM activities.',
        'group': 'Pipeline Management'
    }
}
