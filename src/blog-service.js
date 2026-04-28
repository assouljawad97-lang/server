const { randomUUID } = require('crypto');
const mongoose = require('mongoose');
const { connectDB } = require('./db');

const blogSchema = new mongoose.Schema({
  id: { type: String, index: true },
  title: { type: String, index: true },
  category: String,
  summary: String,
  contentHtml: String,
  coverImageUrl: String,
  readingMinutes: Number,
  status: { type: String, index: true }, // DRAFT | PUBLISHED
  author: String,
  createdAt: { type: String, index: true },
  updatedAt: String,
  publishedAt: { type: String, index: true }
});

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', blogSchema);

function nowIso() {
  return new Date().toISOString();
}

function normalizePost(row) {
  return {
    id: row.id,
    title: row.title || '',
    category: row.category || '',
    summary: row.summary || '',
    contentHtml: row.contentHtml || '',
    coverImageUrl: row.coverImageUrl || '',
    readingMinutes: Number(row.readingMinutes || 0),
    status: row.status || 'DRAFT',
    author: row.author || 'admin',
    createdAt: row.createdAt || '',
    updatedAt: row.updatedAt || '',
    publishedAt: row.publishedAt || ''
  };
}

async function listBlogPosts({ includeDraft = false } = {}) {
  await connectDB();
  const query = includeDraft ? {} : { status: 'PUBLISHED' };
  const rows = await BlogPost.find(query).sort({ publishedAt: -1, createdAt: -1 }).lean();
  return rows.map(normalizePost);
}

async function getBlogPostById(id, { includeDraft = false } = {}) {
  await connectDB();
  const row = await BlogPost.findOne({ id: String(id || '').trim() }).lean();
  if (!row) return null;
  if (!includeDraft && String(row.status || '').toUpperCase() !== 'PUBLISHED') return null;
  return normalizePost(row);
}

async function createBlogPost({ title, category, summary, contentHtml, coverImageUrl, readingMinutes, status, author }) {
  await connectDB();
  const current = nowIso();
  const normalizedStatus = String(status || 'DRAFT').toUpperCase() === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
  const post = await BlogPost.create({
    id: randomUUID(),
    title: String(title || '').trim(),
    category: String(category || '').trim(),
    summary: String(summary || '').trim(),
    contentHtml: String(contentHtml || '').trim(),
    coverImageUrl: String(coverImageUrl || '').trim(),
    readingMinutes: Number(readingMinutes || 0),
    status: normalizedStatus,
    author: String(author || 'admin').trim() || 'admin',
    createdAt: current,
    updatedAt: current,
    publishedAt: normalizedStatus === 'PUBLISHED' ? current : ''
  });
  return normalizePost(post.toObject());
}

async function updateBlogPost(id, { title, category, summary, contentHtml, coverImageUrl, readingMinutes, status, author }) {
  await connectDB();
  const post = await BlogPost.findOne({ id: String(id || '').trim() });
  if (!post) throw new Error('Post not found.');
  const normalizedStatus = String(status || 'DRAFT').toUpperCase() === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
  post.title = String(title || '').trim();
  post.category = String(category || '').trim();
  post.summary = String(summary || '').trim();
  post.contentHtml = String(contentHtml || '').trim();
  post.coverImageUrl = String(coverImageUrl || '').trim();
  post.readingMinutes = Number(readingMinutes || 0);
  post.status = normalizedStatus;
  post.author = String(author || post.author || 'admin').trim() || 'admin';
  post.updatedAt = nowIso();
  if (normalizedStatus === 'PUBLISHED' && !post.publishedAt) post.publishedAt = nowIso();
  if (normalizedStatus === 'DRAFT') post.publishedAt = '';
  await post.save();
  return normalizePost(post.toObject());
}

async function deleteBlogPost(id) {
  await connectDB();
  const result = await BlogPost.deleteOne({ id: String(id || '').trim() });
  return { deleted: Number(result.deletedCount || 0) > 0 };
}

module.exports = {
  listBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
};
