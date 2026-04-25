const { randomUUID } = require('crypto');
const mongoose = require('mongoose');
const { connectDB } = require('./db');

const orderSchema = new mongoose.Schema({
  id: { type: String, index: true },
  firstName: String,
  lastName: String,
  fullName: String,
  email: { type: String, index: true },
  phone: String,
  status: { type: String, index: true },
  createdAt: { type: String, index: true },
  updatedAt: String,
  responses: Array
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

function nowIso() {
  return new Date().toISOString();
}

async function createOrder({ firstName, lastName, email, phone }) {
  await connectDB();
  const order = await Order.create({
    id: randomUUID(),
    firstName: String(firstName || '').trim(),
    lastName: String(lastName || '').trim(),
    fullName: `${String(firstName || '').trim()} ${String(lastName || '').trim()}`.trim(),
    email: String(email || '').trim().toLowerCase(),
    phone: String(phone || '').trim(),
    status: 'NEW',
    createdAt: nowIso(),
    updatedAt: nowIso(),
    responses: []
  });
  return order.toObject();
}

async function listOrders() {
  await connectDB();
  const rows = await Order.find().sort({ createdAt: -1 }).lean();
  return rows.map((row) => ({
    id: row.id,
    firstName: row.firstName || '',
    lastName: row.lastName || '',
    fullName: row.fullName || '',
    email: row.email || '',
    phone: row.phone || '',
    status: row.status || 'NEW',
    createdAt: row.createdAt || '',
    updatedAt: row.updatedAt || '',
    responses: Array.isArray(row.responses) ? row.responses : []
  }));
}

async function respondToOrder({
  orderId,
  adminUser,
  subject,
  message,
  activationKey,
  emailStatus = 'PENDING',
  emailError = '',
  emailMeta = null
}) {
  await connectDB();
  const order = await Order.findOne({ id: String(orderId || '').trim() });
  if (!order) {
    throw new Error('Order not found.');
  }
  const response = {
    id: randomUUID(),
    createdAt: nowIso(),
    adminUser: String(adminUser || 'admin').trim() || 'admin',
    subject: String(subject || '').trim(),
    message: String(message || '').trim(),
    activationKey: String(activationKey || '').trim(),
    emailStatus: String(emailStatus || 'PENDING').trim().toUpperCase(),
    emailError: String(emailError || '').trim(),
    emailMeta: emailMeta && typeof emailMeta === 'object' ? emailMeta : null
  };
  const responses = Array.isArray(order.responses) ? order.responses : [];
  responses.unshift(response);
  order.responses = responses;
  order.status = 'RESPONDED';
  order.updatedAt = nowIso();
  await order.save();
  return {
    id: order.id,
    status: order.status,
    updatedAt: order.updatedAt,
    response
  };
}

module.exports = {
  createOrder,
  listOrders,
  respondToOrder
};
