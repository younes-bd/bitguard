import client from '@/core/api/client';

export const campaigns = {
  // Campaigns
  getItems: (params) => client.get('campaigns/campaigns/', { params }),
  getItem: (id) => client.get(`campaigns/campaigns/${id}/`),
  createItem: (data) => client.post('campaigns/campaigns/', data),
  updateItem: (id, data) => client.patch(`campaigns/campaigns/${id}/`, data),
  deleteItem: (id) => client.delete(`campaigns/campaigns/${id}/`),
  sendCampaign: (id) => client.post(`campaigns/campaigns/${id}/send_now/`),
  scheduleCampaign: (id, schedule_date) => client.post(`campaigns/campaigns/${id}/schedule/`, { schedule_date }),

  // Mailing Lists
  getLists: (params) => client.get('campaigns/lists/', { params }),
  getList: (id) => client.get(`campaigns/lists/${id}/`),
  createList: (data) => client.post('campaigns/lists/', data),
  updateList: (id, data) => client.patch(`campaigns/lists/${id}/`, data),
  deleteList: (id) => client.delete(`campaigns/lists/${id}/`),
  
  // Mailing Contacts
  getContacts: (params) => client.get('campaigns/contacts/', { params }),
  getContact: (id) => client.get(`campaigns/contacts/${id}/`),
  createContact: (data) => client.post('campaigns/contacts/', data),
  updateContact: (id, data) => client.patch(`campaigns/contacts/${id}/`, data),
  deleteContact: (id) => client.delete(`campaigns/contacts/${id}/`),
};

export const campaignsService = campaigns;
