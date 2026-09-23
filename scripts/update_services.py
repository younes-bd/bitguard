import sys
import re

def append_to_object(filepath, code_to_append):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the last closing brace of the export object. 
    # For settingsService.js, it's };
    # For coreService.js, it might have multiple exports, we need to append to coreService = { ... };
    # Let's just find the export const coreService = { block and append before its closing brace.
    
    obj_name = filepath.split('/')[-1].split('.')[0] # e.g. coreService
    
    pattern = r'(export\s+const\s+' + obj_name + r'\s*=\s*\{)(.*?)(\n\};)'
    
    match = re.search(pattern, content, re.DOTALL)
    if match:
        new_content = content[:match.end(2)] + ",\n" + code_to_append + match.group(3) + content[match.end(3):]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Successfully updated {filepath}")
    else:
        print(f"Could not find object in {filepath}")

core_code = '''
    getConfigOptions: () => apiClient.get('core/config-options/'),
    getModules: (params) => apiClient.get('core/modules/', { params }),
    updateModule: (id, payload) => apiClient.patch(core/modules//, payload),
    getSequences: (params) => apiClient.get('core/sequences/', { params }),
    createSequence: (payload) => apiClient.post('core/sequences/', payload),
    updateSequence: (id, payload) => apiClient.patch(core/sequences//, payload),
    deleteSequence: (id) => apiClient.delete(core/sequences//),
    getSections: () => apiClient.get('core/sections/'),
    updateSection: (id, payload) => apiClient.patch(core/sections//, payload)
'''.strip()

users_code = '''
    getContentTypes: () => client.get('users/content-types/'),
    getRolePermissionsMatrix: () => client.get('users/role-permissions/matrix/'),
    getRolePermissions: (params) => client.get('users/role-permissions/', { params }),
    createRolePermission: (data) => client.post('users/role-permissions/', data),
    updateRolePermission: (id, data) => client.patch(users/role-permissions//, data),
    inviteUser: (data) => client.post('users/invite/', data),
    resendInvitation: (id) => client.post(users/invitations//resend/),
    resetPassword: (id) => client.post(users//reset_password/),
    getRoleUsers: (id) => client.get(users/roles//users/),
    assignUsersToRole: (id, data) => client.post(users/roles//assign_users/, data)
'''.strip()

settings_code = '''
    deleteSetting: (id) => apiClient.delete(system/settings//)
'''.strip()

append_to_object('frontend/src/apps/core/api/coreService.js', core_code)
append_to_object('frontend/src/apps/users/api/usersService.js', users_code)
append_to_object('frontend/src/apps/system/api/settingsService.js', settings_code)

