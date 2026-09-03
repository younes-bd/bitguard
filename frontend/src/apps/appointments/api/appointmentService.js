import client from '@/core/api/client';

class AppointmentService {
    async getAppointments(params = {}) {
        const response = await client.get('appointments/appointments/', { params });
        return response.data?.data ?? response.data;
    }

    async getAppointment(id) {
        const response = await client.get(`appointments/appointments/${id}/`);
        return response.data?.data ?? response.data;
    }

    async createAppointment(data) {
        const response = await client.post('appointments/appointments/', data);
        return response.data?.data ?? response.data;
    }

    async updateAppointment(id, data) {
        const response = await client.put(`appointments/appointments/${id}/`, data);
        return response.data?.data ?? response.data;
    }

    async deleteAppointment(id) {
        const response = await client.delete(`appointments/appointments/${id}/`);
        return response.data?.data ?? response.data;
    }
}

export const appointmentService = new AppointmentService();
export default appointmentService;
