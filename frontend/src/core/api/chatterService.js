/**
 * chatterService.js — Unified API service for the Chatter system
 *
 * Mirrors Odoo's mail.thread / mail.activity.mixin REST API.
 * All methods accept a `model` param in dot-notation: 'crm.Deal', 'helpdesk.Ticket', etc.
 *
 * Endpoints (all under /api/v1/core/):
 *   GET  chatter/?model=&object_id=   → Full chatter summary (messages + activities + followers + log)
 *   POST messages/                    → Post a message or internal note
 *   POST activities/                  → Schedule an activity
 *   PATCH activities/<id>/done/       → Mark activity as done
 *   GET  activities/my-activities/    → All open activities for current user
 *   POST followers/                   → Follow a record
 *   DELETE followers/unfollow/        → Unfollow a record
 */

import client from './client';

const BASE = 'core';

// ── Chatter Summary ──────────────────────────────────────────────────────────

/**
 * Load the full chatter widget data for a record in one request.
 * Returns: { messages, activities, followers, change_log, is_following }
 *
 * @param {string} model  - e.g. 'crm.Deal'
 * @param {string} objectId - UUID of the record
 */
const getChatter = (model, objectId) =>
  client.get(`${BASE}/chatter/`, { params: { model, object_id: objectId } })
    .then(r => r.data);

// ── Messages ─────────────────────────────────────────────────────────────────

/**
 * Post a public message (comment) to a record's chatter thread.
 * Followers will be notified.
 *
 * @param {object} payload
 * @param {string} payload.content_type  - ContentType ID (int)
 * @param {string} payload.object_id     - UUID string
 * @param {string} payload.body          - Message body (supports HTML)
 * @param {string} [payload.subject]     - Optional subject
 * @param {string} [payload.message_type] - 'comment' | 'note' | 'email' | 'notification'
 * @param {boolean} [payload.is_internal] - true = internal note (amber styling)
 */
const postMessage = (payload) =>
  client.post(`${BASE}/messages/`, payload).then(r => r.data);

/**
 * Post an internal note (only visible to team members, not sent externally).
 */
const postNote = (contentTypeId, objectId, body) =>
  postMessage({
    content_type: contentTypeId,
    object_id: objectId,
    body,
    message_type: 'note',
    is_internal: true,
  });

/**
 * Fetch all messages for a record.
 */
const getMessages = (model, objectId) =>
  client.get(`${BASE}/messages/`, { params: { model, object_id: objectId } })
    .then(r => r.data);

/**
 * Delete a message (author or admin only).
 */
const deleteMessage = (messageId) =>
  client.delete(`${BASE}/messages/${messageId}/`).then(r => r.data);

// ── Activities ───────────────────────────────────────────────────────────────

/**
 * Schedule a new activity on a record.
 *
 * @param {object} payload
 * @param {string} payload.content_type   - ContentType ID (int)
 * @param {string} payload.object_id      - UUID string
 * @param {string} payload.activity_type  - 'call' | 'email' | 'meeting' | 'todo' | 'upload' | 'custom'
 * @param {string} payload.due_date       - ISO date string 'YYYY-MM-DD'
 * @param {string} [payload.summary]      - Short description
 * @param {string} [payload.note]         - Detailed note
 * @param {string} [payload.assigned_to]  - User UUID (defaults to current user)
 */
const scheduleActivity = (payload) =>
  client.post(`${BASE}/activities/`, payload).then(r => r.data);

/**
 * Mark an activity as done.
 *
 * @param {string} activityId - UUID of the activity
 * @param {string} [feedback] - Optional completion note
 */
const markActivityDone = (activityId, feedback = '') =>
  client.patch(`${BASE}/activities/${activityId}/done/`, { feedback }).then(r => r.data);

/**
 * Get all open activities for a specific record.
 */
const getActivities = (model, objectId, showDone = false) =>
  client.get(`${BASE}/activities/`, {
    params: { model, object_id: objectId, show_done: showDone }
  }).then(r => r.data);

/**
 * Get all open activities assigned to the current user (across all records).
 * Used to display the activity badge count in the top navigation.
 */
const getMyActivities = () =>
  client.get(`${BASE}/activities/my-activities/`).then(r => r.data);

/**
 * Delete/cancel an activity.
 */
const deleteActivity = (activityId) =>
  client.delete(`${BASE}/activities/${activityId}/`).then(r => r.data);

// ── Followers ────────────────────────────────────────────────────────────────

/**
 * Follow a record (subscribe to notifications).
 *
 * @param {number} contentTypeId  - Django ContentType ID
 * @param {string} objectId       - UUID of the record
 */
const followRecord = (contentTypeId, objectId) =>
  client.post(`${BASE}/followers/`, {
    content_type: contentTypeId,
    object_id: objectId,
  }).then(r => r.data);

/**
 * Unfollow a record.
 *
 * @param {string} model     - e.g. 'crm.Deal'
 * @param {string} objectId  - UUID of the record
 */
const unfollowRecord = (model, objectId) =>
  client.delete(`${BASE}/followers/unfollow/`, {
    data: { model, object_id: objectId }
  }).then(r => r.data);

// ── Field Change Log ─────────────────────────────────────────────────────────

/**
 * Get the field-change audit trail for a record.
 * These are written automatically by the service layer when tracked fields change.
 */
const getChangeLog = (model, objectId) =>
  client.get(`${BASE}/field-changes/`, { params: { model, object_id: objectId } })
    .then(r => r.data);

// ── Exports ──────────────────────────────────────────────────────────────────

const chatterService = {
  // Summary (one-shot load)
  getChatter,

  // Messages
  postMessage,
  postNote,
  getMessages,
  deleteMessage,

  // Activities
  scheduleActivity,
  markActivityDone,
  getActivities,
  getMyActivities,
  deleteActivity,

  // Followers
  followRecord,
  unfollowRecord,

  // Change log
  getChangeLog,
};

export default chatterService;
