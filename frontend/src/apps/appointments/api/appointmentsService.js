import client from '@/core/api/client';

export const appointmentsService = {
    getAppointments: async (params = {}) => client.get('appointments/appointments/', { params }).then(r => r.data?.results ?? r.data),
};
