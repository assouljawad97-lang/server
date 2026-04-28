async function loadBlogPosts() {
  const list = document.getElementById('blogList');
  if (!list) return;
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');
  try {
    if (postId) {
      return loadSinglePost(postId, list);
    }
    const response = await fetch('/api/blogs');
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message || 'Failed to load posts.');
    const posts = Array.isArray(data.posts) ? data.posts : [];
    if (!posts.length) {
      list.innerHTML = '<div class="report-card"><div class="report-card-body">No posts yet.</div></div>';
      return;
    }
    list.className = 'blog-grid';
    list.innerHTML = posts.map((post) => `
      <article class="blog-card">
        <div class="blog-card-cover" style="background-image:url('${escapeHtml(post.coverImageUrl || '/hero.png')}')">
          <span class="blog-chip">${escapeHtml(post.category || 'Officino')}</span>
        </div>
        <div class="blog-card-body">
          <div class="blog-meta">${new Date(post.publishedAt || post.createdAt || Date.now()).toLocaleDateString()} · ${Number(post.readingMinutes || 5)} min</div>
          <h3>${escapeHtml(post.title || '-')}</h3>
          <p class="mb-2">${escapeHtml(post.summary || '')}</p>
          <a class="blog-link" href="/blog?id=${encodeURIComponent(post.id)}">Leer artículo →</a>
        </div>
      </article>
    `).join('');
  } catch (error) {
    list.innerHTML = `<div class="report-card"><div class="report-card-body text-danger">${escapeHtml(String(error.message || error))}</div></div>`;
  }
}

async function loadSinglePost(postId, list) {
  const response = await fetch(`/api/blogs/${encodeURIComponent(postId)}`);
  const data = await response.json();
  if (!response.ok || !data.ok || !data.post) throw new Error(data.message || 'Post not found.');
  const post = data.post;
  list.className = '';
  list.innerHTML = `
    <article class="blog-post-single">
      <a class="blog-link d-inline-block mb-3" href="/blog">← Volver al blog</a>
      <div class="blog-meta mt-3">${new Date(post.publishedAt || post.createdAt || Date.now()).toLocaleDateString()} · ${Number(post.readingMinutes || 5)} min · ${escapeHtml(post.category || 'Officino')}</div>
      <h2 class="mt-2">${escapeHtml(post.title || '-')}</h2>
      <p class="text-muted">${escapeHtml(post.summary || '')}</p>
      <div class="blog-post-content">${post.contentHtml || ''}</div>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

loadBlogPosts();
