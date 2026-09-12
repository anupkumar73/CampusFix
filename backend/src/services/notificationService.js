
const Notification = require("../models/Notification");
const store = require("../config/store");

async function createNotification(data) {
  if (global.__campusfixMongo) return Notification.create(data);
  const db = store.load();
  const item = { _id: `n_${Date.now()}_${Math.random().toString(16).slice(2)}`, createdAt: new Date(), read:false, ...data };
  db.notifications.push(item);
  store.save(db);
  global.__campusfixNotifications = db.notifications;
  return item;
}
module.exports = { createNotification };
