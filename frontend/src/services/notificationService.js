import api from './api';

export const getNotifications = () => api.get('/notifications');
export const getAdminNotifications = () => api.get('/notifications/admin');
export const getUnreadCount = () => api.get('/notifications/unread-count');
export const markAllRead = () => api.put('/notifications/read-all');
export const markOneRead = (id) => api.put('/notifications/' + id + '/read');
