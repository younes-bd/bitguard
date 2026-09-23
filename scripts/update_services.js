const fs = require('fs');
const path = require('path');

function appendToFile(filePath, newCode) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Simple append before closing brace or just at the end. 
        // For settingsService, it's an object export.
        if (content.includes('export const')) {
            content = content.replace(/};?\s*$/, newCode + '\n};\n');
            fs.writeFileSync(filePath, content);
        }
    }
}

// 1. Update coreService.js
const coreServicePath = path.join(__dirname, 'frontend', 'src', 'apps', 'core', 'api', 'coreService.js');
appendToFile(coreServicePath, 
    getConfigOptions: () => apiClient.get('core/config-options/'),
    getModules: (params) => apiClient.get('core/modules/', { params }),
    updateModule: (id, payload) => apiClient.patch(\core/modules/\/\, payload),
    getSequences: (params) => apiClient.get('core/sequences/', { params }),
    createSequence: (payload) => apiClient.post('core/sequences/', payload),
    updateSequence: (id, payload) => apiClient.patch(\core/sequences/\/\, payload),
    deleteSequence: (id) => apiClient.delete(\core/sequences/\/\),
    getSections: () => apiClient.get('core/sections/'),
    updateSection: (id, payload) => apiClient.patch(\core/sections/\/\, payload));

// 2. Update usersService.js
const usersServicePath = path.join(__dirname, 'frontend', 'src', 'apps', 'users', 'api', 'usersService.js');
appendToFile(usersServicePath, 
    getContentTypes: () => client.get('users/content-types/'),
    getRolePermissionsMatrix: () => client.get('users/role-permissions/matrix/'),
    getRolePermissions: (params) => client.get('users/role-permissions/', { params }),
    createRolePermission: (data) => client.post('users/role-permissions/', data),
    updateRolePermission: (id, data) => client.patch(\users/role-permissions/\/\, data),
    inviteUser: (data) => client.post('users/invite/', data),
    resendInvitation: (id) => client.post(\users/invitations/\/resend/\),
    resetPassword: (id) => client.post(\users/\/reset_password/\),
    getRoleUsers: (id) => client.get(\users/roles/\/users/\),
    assignUsersToRole: (id, data) => client.post(\users/roles/\/assign_users/\, data));

// 3. Update settingsService.js
const settingsServicePath = path.join(__dirname, 'frontend', 'src', 'apps', 'system', 'api', 'settingsService.js');
appendToFile(settingsServicePath, 
    deleteSetting: (id) => apiClient.delete(\system/settings/\/\));

console.log('Services updated successfully!');
