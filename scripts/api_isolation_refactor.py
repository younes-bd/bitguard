import os
import re

base_dir = r"c:\Users\youne\Desktop\2-InfoTech\website\website13\frontend\src\apps"

# 1. Create reportingService.js
reporting_service_path = os.path.join(base_dir, "reporting", "api", "reportingService.js")
os.makedirs(os.path.dirname(reporting_service_path), exist_ok=True)
with open(reporting_service_path, "w", encoding="utf-8") as f:
    f.write("import apiClient from '@/core/api/client';\n\nexport const reportingService = {\n  getTemplates: () => apiClient.get('reporting/templates/'),\n  createTemplate: (data) => apiClient.post('reporting/templates/', data),\n  updateTemplate: (id, data) => apiClient.patch(`reporting/templates/${id}/`, data),\n  deleteTemplate: (id) => apiClient.delete(`reporting/templates/${id}/`),\n\n  getTags: () => apiClient.get('reporting/tags/'),\n  createTag: (data) => apiClient.post('reporting/tags/', data),\n  updateTag: (id, data) => apiClient.patch(`reporting/tags/${id}/`, data),\n  deleteTag: (id) => apiClient.delete(`reporting/tags/${id}/`)\n};\n\nexport default reportingService;\n")

# 2. Create automationService.js
automation_service_path = os.path.join(base_dir, "automation", "api", "automationService.js")
os.makedirs(os.path.dirname(automation_service_path), exist_ok=True)
with open(automation_service_path, "w", encoding="utf-8") as f:
    f.write("import apiClient from '@/core/api/client';\n\nexport const automationService = {\n  getActions: (params) => apiClient.get('automation/actions/', { params }),\n  getAction: (id) => apiClient.get(`automation/actions/${id}/`),\n  createAction: (data) => apiClient.post('automation/actions/', data),\n  updateAction: (id, data) => apiClient.put(`automation/actions/${id}/`, data),\n  deleteAction: (id) => apiClient.delete(`automation/actions/${id}/`),\n  toggleAction: (id, isActive) => apiClient.patch(`automation/actions/${id}/`, { is_active: isActive }),\n  runAction: (id) => apiClient.post(`automation/actions/${id}/run/`),\n};\n\nexport default automationService;\n")

# 3. Create notificationsService.js
notifications_service_path = os.path.join(base_dir, "notifications", "api", "notificationsService.js")
os.makedirs(os.path.dirname(notifications_service_path), exist_ok=True)
with open(notifications_service_path, "w", encoding="utf-8") as f:
    f.write("import apiClient from '@/core/api/client';\n\nexport const notificationsService = {\n  getEmailTemplates: (params) => apiClient.get('notifications/email-templates/'),\n  getEmailTemplate: (id) => apiClient.get(`notifications/email-templates/${id}/`),\n  createEmailTemplate: (data) => apiClient.post('notifications/email-templates/', data),\n  updateEmailTemplate: (id, data) => apiClient.patch(`notifications/email-templates/${id}/`, data),\n  deleteEmailTemplate: (id) => apiClient.delete(`notifications/email-templates/${id}/`),\n  testEmailTemplate: (id, data) => apiClient.post(`notifications/email-templates/${id}/send_test/`, data),\n\n  getOutgoingServers: () => apiClient.get('notifications/mail-servers-outgoing/'),\n  createOutgoingServer: (data) => apiClient.post('notifications/mail-servers-outgoing/', data),\n  updateOutgoingServer: (id, data) => apiClient.patch(`notifications/mail-servers-outgoing/${id}/`, data),\n  deleteOutgoingServer: (id) => apiClient.delete(`notifications/mail-servers-outgoing/${id}/`),\n  testOutgoingServer: (id) => apiClient.post(`notifications/mail-servers-outgoing/${id}/test/`),\n\n  getIncomingServers: () => apiClient.get('notifications/mail-servers-incoming/'),\n  createIncomingServer: (data) => apiClient.post('notifications/mail-servers-incoming/', data),\n  updateIncomingServer: (id, data) => apiClient.patch(`notifications/mail-servers-incoming/${id}/`, data),\n  deleteIncomingServer: (id) => apiClient.delete(`notifications/mail-servers-incoming/${id}/`),\n  fetchIncomingMail: (id) => apiClient.post(`notifications/mail-servers-incoming/${id}/fetch_now/`),\n\n  getMailAliases: () => apiClient.get('notifications/mail-aliases/'),\n  createMailAlias: (data) => apiClient.post('notifications/mail-aliases/', data),\n  updateMailAlias: (id, data) => apiClient.patch(`notifications/mail-aliases/${id}/`, data),\n  deleteMailAlias: (id) => apiClient.delete(`notifications/mail-aliases/${id}/`),\n};\n\nexport default notificationsService;\n")

# 4. Create coreService.js
core_service_path = os.path.join(base_dir, "core", "api", "coreService.js")
os.makedirs(os.path.dirname(core_service_path), exist_ok=True)
with open(core_service_path, "w", encoding="utf-8") as f:
    f.write("import apiClient from '@/core/api/client';\n\nexport const coreService = {\n  getScheduledActions: () => apiClient.get('core/scheduled-actions/'),\n  toggleScheduledAction: (id, isActive) => apiClient.patch(`core/scheduled-actions/${id}/`, { is_active: isActive }),\n  runScheduledAction: (id) => apiClient.post(`core/scheduled-actions/${id}/run/`),\n  deleteScheduledAction: (id) => apiClient.delete(`core/scheduled-actions/${id}/`),\n  createScheduledAction: (data) => apiClient.post('core/scheduled-actions/', data),\n  updateScheduledAction: (id, data) => apiClient.put(`core/scheduled-actions/${id}/`, data),\n\n  getLanguages: () => apiClient.get('core/languages/'),\n  createLanguage: (data) => apiClient.post('core/languages/', data),\n  updateLanguage: (id, data) => apiClient.patch(`core/languages/${id}/`, data),\n  deleteLanguage: (id) => apiClient.delete(`core/languages/${id}/`),\n  setDefaultLanguage: (id) => apiClient.post(`core/languages/${id}/set_default/`),\n};\n\nexport default coreService;\n")

def update_file(path, replacements):
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    for old, new in replacements:
        content = re.sub(old, new, content)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

# 5. JSX replacements for Reporting, Automation, Notifications
update_file(os.path.join(base_dir, "reporting", "pages", "lists", "ReportsList.jsx"), [
    (r"import client from '@/core/api/client';", r"import { reportingService } from '../../api/reportingService';"),
    (r"client\.get\('system/reports/'\)", r"reportingService.getTemplates()"),
    (r"client\.patch\(`system/reports/\$\{form\.id\}/`, form\)", r"reportingService.updateTemplate(form.id, form)"),
    (r"client\.post\('system/reports/', form\)", r"reportingService.createTemplate(form)"),
    (r"client\.delete\(`system/reports/\$\{id\}/`\)", r"reportingService.deleteTemplate(id)")
])

update_file(os.path.join(base_dir, "reporting", "pages", "lists", "ReportTagsList.jsx"), [
    (r"import client from '@/core/api/client';", r"import { reportingService } from '../../api/reportingService';"),
    (r"client\.get\('system/report-tags/'\)", r"reportingService.getTags()"),
    (r"client\.patch\(`system/report-tags/\$\{form\.id\}/`, form\)", r"reportingService.updateTag(form.id, form)"),
    (r"client\.post\('system/report-tags/', form\)", r"reportingService.createTag(form)"),
    (r"client\.delete\(`system/report-tags/\$\{id\}/`\)", r"reportingService.deleteTag(id)")
])

update_file(os.path.join(base_dir, "automation", "pages", "lists", "AutomatedActions.jsx"), [
    (r"import client from '@/core/api/client';", r"import { automationService } from '../../api/automationService';"),
    (r"client\.get\('system/automated-actions/'\)", r"automationService.getActions()"),
    (r"client\.patch\(`system/automated-actions/\$\{editingAction\.id\}/`, form\)", r"automationService.updateAction(editingAction.id, form)"),
    (r"client\.post\('system/automated-actions/', form\)", r"automationService.createAction(form)"),
    (r"client\.delete\(`system/automated-actions/\$\{id\}/`\)", r"automationService.deleteAction(id)"),
    (r"client\.post\(`system/automated-actions/\$\{id\}/run/`\)", r"automationService.runAction(id)")
])

update_file(os.path.join(base_dir, "notifications", "pages", "lists", "EmailTemplates.jsx"), [
    (r"import client from '@/core/api/client';", r"import { notificationsService } from '../../api/notificationsService';"),
    (r"client\.get\('system/email-templates/'\)", r"notificationsService.getEmailTemplates()"),
    (r"client\.post\(`system/email-templates/\$\{selectedId\}/send_test/`, \{ email: testEmail \}\)", r"notificationsService.testEmailTemplate(selectedId, { email: testEmail })"),
    (r"client\.patch\(`system/email-templates/\$\{form\.id\}/`, form\)", r"notificationsService.updateEmailTemplate(form.id, form)"),
    (r"client\.post\('system/email-templates/', form\)", r"notificationsService.createEmailTemplate(form)"),
    (r"client\.delete\(`system/email-templates/\$\{id\}/`\)", r"notificationsService.deleteEmailTemplate(id)")
])

update_file(os.path.join(base_dir, "notifications", "pages", "lists", "OutgoingMailServers.jsx"), [
    (r"import client from '@/core/api/client';", r"import { notificationsService } from '../../api/notificationsService';"),
    (r"client\.get\('system/mail-servers-outgoing/'\)", r"notificationsService.getOutgoingServers()"),
    (r"client\.patch\(`system/mail-servers-outgoing/\$\{([^}]+)\}/`, form\)", r"notificationsService.updateOutgoingServer(r'\1', form)"),
    (r"client\.post\('system/mail-servers-outgoing/', form\)", r"notificationsService.createOutgoingServer(form)"),
    (r"client\.delete\(`system/mail-servers-outgoing/\$\{([^}]+)\}/`\)", r"notificationsService.deleteOutgoingServer(r'\1')"),
    (r"client\.post\(`system/mail-servers-outgoing/\$\{([^}]+)\}/test/`\)", r"notificationsService.testOutgoingServer(r'\1')"),
])

update_file(os.path.join(base_dir, "notifications", "pages", "lists", "IncomingMailServers.jsx"), [
    (r"import client from '@/core/api/client';", r"import { notificationsService } from '../../api/notificationsService';"),
    (r"client\.get\('system/mail-servers-incoming/'\)", r"notificationsService.getIncomingServers()"),
    (r"client\.patch\(`system/mail-servers-incoming/\$\{([^}]+)\}/`, form\)", r"notificationsService.updateIncomingServer(r'\1', form)"),
    (r"client\.post\('system/mail-servers-incoming/', form\)", r"notificationsService.createIncomingServer(form)"),
    (r"client\.delete\(`system/mail-servers-incoming/\$\{([^}]+)\}/`\)", r"notificationsService.deleteIncomingServer(r'\1')"),
    (r"client\.post\(`system/mail-servers-incoming/\$\{([^}]+)\}/fetch_now/`\)", r"notificationsService.fetchIncomingMail(r'\1')"),
])

update_file(os.path.join(base_dir, "notifications", "pages", "lists", "MailAliasesList.jsx"), [
    (r"import client from '@/core/api/client';", r"import { notificationsService } from '../../api/notificationsService';"),
    (r"client\.get\('system/mail-aliases/'\)", r"notificationsService.getMailAliases()"),
    (r"client\.patch\(`system/mail-aliases/\$\{([^}]+)\}/`, form\)", r"notificationsService.updateMailAlias(r'\1', form)"),
    (r"client\.post\('system/mail-aliases/', form\)", r"notificationsService.createMailAlias(form)"),
    (r"client\.delete\(`system/mail-aliases/\$\{([^}]+)\}/`\)", r"notificationsService.deleteMailAlias(r'\1')"),
])

# 6. Core JSX replacements
update_file(os.path.join(base_dir, "core", "pages", "lists", "ScheduledActions.jsx"), [
    (r"import \{ settingsService \} from '../../api/settingsService';", r"import { coreService } from '../../api/coreService';"),
    (r"settingsService\.", r"coreService.")
])

update_file(os.path.join(base_dir, "core", "pages", "lists", "Languages.jsx"), [
    (r"import \{ settingsService \} from '../../api/settingsService';", r"import { coreService } from '../../api/coreService';"),
    (r"settingsService\.", r"coreService.")
])

update_file(os.path.join(base_dir, "core", "pages", "features", "TranslationsExport.jsx"), [
    (r"'system/translations/", r"'core/translations/"),
    (r"import \{ settingsService \} from '../../api/settingsService';", r"import { coreService } from '../../api/coreService';"),
    (r"settingsService\.", r"coreService.")
])

update_file(os.path.join(base_dir, "core", "pages", "features", "TranslationsImport.jsx"), [
    (r"'system/translations/", r"'core/translations/")
])

# 7. Clean up settingsService.js
settings_service_path = os.path.join(base_dir, "system", "api", "settingsService.js")
if os.path.exists(settings_service_path):
    with open(settings_service_path, "r", encoding="utf-8") as f:
        content = f.read()

    methods_to_remove = [
        r"\s*// Scheduled Actions[\s\S]*?(?=\n\s*//)",
        r"\s*// Languages[\s\S]*?(?=\n\s*//)",
        r"\s*// Outgoing Mail Servers.*?[\s\S]*?(?=\n\s*//)",
        r"\s*// Incoming Mail Servers.*?[\s\S]*?(?=\n\s*//)",
        r"\s*// Email Templates[\s\S]*?(?=\n\s*//)",
        r"\s*// Automated Actions.*?[\s\S]*?(?=\n\s*//)",
        r"\s*// Reports\n\s*getReports:[^\n]+\n"
    ]
    for block in methods_to_remove:
        content = re.sub(block, "\n", content)
    
    content = re.sub(r",\s*\n\s*};", "\n};", content)
    with open(settings_service_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Refactoring complete.")
