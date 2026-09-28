import client from '@/core/api/client';

export const databaseBackupService = {
    getBackups: () => client.get('core/database-backups/'),
    triggerBackup: () => client.post('core/database-backups/trigger/')
};
