import client from '../../../core/api/client';

const BASE = 'crm';

export default {
  // Deals
  getDeals: (params) => client.get(`${BASE}/deals/`, { params }),
  getDeal: (id) => client.get(`${BASE}/deals/${id}/`),
  createDeal: (data) => client.post(`${BASE}/deals/`, data),
  updateDeal: (id, data) => client.patch(`${BASE}/deals/${id}/`, data),
  setDealStage: (id, stageId) => client.post(`${BASE}/deals/${id}/set-stage/`, { stage_id: stageId }),
  markDealWon: (id) => client.post(`${BASE}/deals/${id}/mark-won/`),
  markDealLost: (id, reasonId) => client.post(`${BASE}/deals/${id}/mark-lost/`, { lost_reason_id: reasonId }),
  
  // Leads
  getLeads: (params) => client.get(`${BASE}/leads/`, { params }),
  getLead: (id) => client.get(`${BASE}/leads/${id}/`),
  createLead: (data) => client.post(`${BASE}/leads/`, data),
  updateLead: (id, data) => client.patch(`${BASE}/leads/${id}/`, data),
  convertLead: (id) => client.post(`${BASE}/leads/${id}/convert/`),
  markLeadLost: (id) => client.post(`${BASE}/leads/${id}/mark-lost/`),

  // Config
  getStages: () => client.get(`${BASE}/stages/`),
  getTeams: () => client.get(`${BASE}/teams/`),
  getLostReasons: () => client.get(`${BASE}/lost-reasons/`),
  getTags: () => client.get(`${BASE}/tags/`),
};
