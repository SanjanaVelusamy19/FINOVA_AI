import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find()
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();
  res.json({ notifications });
};

export const markNotificationRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  notification.read = true;
  await notification.save();
  res.json({ notification });
};

export const getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({ read: false });
  res.json({ count });
};
