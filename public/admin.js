const STORAGE_KEY = 'officino_admin_token';

let currentLicense = null;
let currentOrder = null;
let managerModal = null;
let licenseModal = null;
let orderResponseModal = null;
let currentPage = 'licenses';
let blogEditor = null;

function getAdminToken() {
  return sessionStorage.getItem(STORAGE_KEY) || '';
}

function setAdminToken(value) {
  sessionStorage.setItem(STORAGE_KEY, value || '');
}

function clearAdminToken() {
  sessionStorage.removeItem(STORAGE_KEY);
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAdminToken()}`
  };
}

function fmtDate(value) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString();
  } catch (error) {
    return value;
  }
}

function shortFingerprint(value) {
  const text = String(value || '').trim();
  if (!text) return '-';
  if (text.length <= 18) return text;
  return `${text.slice(0, 8)}...${text.slice(-8)}`;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setAuthenticatedUi(isAuth) {
  document.getElementById('adminAuthCard')?.classList.toggle('d-none', isAuth);
  document.getElementById('adminListCard')?.classList.toggle('d-none', !isAuth || currentPage !== 'licenses');
  document.getElementById('adminActivationsCard')?.classList.toggle('d-none', !isAuth || currentPage !== 'activations');
  document.getElementById('adminOrdersCard')?.classList.toggle('d-none', !isAuth || currentPage !== 'orders');
  document.getElementById('adminBlogCard')?.classList.toggle('d-none', !isAuth || currentPage !== 'blog');
  document.getElementById('adminDevicesCard')?.classList.toggle('d-none', !isAuth || currentPage !== 'devices');
  document.getElementById('adminLogsCard')?.classList.toggle('d-none', !isAuth || currentPage !== 'logs');
  document.getElementById('adminSidebar')?.classList.toggle('d-none', !isAuth);
  document.getElementById('adminShell')?.classList.toggle('is-authenticated', isAuth);
}

function statusBadge(status) {
  const normalized = String(status || '').toUpperCase();
  let cls = 'bg-secondary-subtle text-secondary';
  if (normalized === 'ACTIVE' || normalized === 'RESPONDED' || normalized === 'SENT') {
    cls = 'bg-success-subtle text-success';
  } else if (normalized === 'NEW') {
    cls = 'bg-warning-subtle text-warning-emphasis';
  } else if (normalized === 'DEACTIVATED' || normalized === 'FAILED' || normalized === 'ERROR') {
    cls = 'bg-danger-subtle text-danger';
  }
  return `<span class="badge ${cls}">${normalized || '-'}</span>`;
}

function blogStatusBadge(status) {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'PUBLISHED') {
    return '<span class="badge bg-success-subtle text-success fw-semibold">Published</span>';
  }
  return '<span class="badge bg-secondary-subtle text-secondary fw-semibold">Draft</span>';
}

function setNewOrdersSidebarBadge(count) {
  const badge = document.getElementById('newOrdersSidebarBadge');
  if (!badge) return;
  const safeCount = Number(count) || 0;
  if (safeCount > 0) {
    badge.classList.remove('d-none');
    badge.textContent = String(safeCount);
  } else {
    badge.classList.add('d-none');
    badge.textContent = '0';
  }
}

async function refreshNewOrdersBadge() {
  try {
    const data = await fetchJson('/api/admin/orders', { headers: authHeaders() });
    const rows = Array.isArray(data.orders) ? data.orders : [];
    const newCount = rows.filter((item) => String(item.status || '').toUpperCase() === 'NEW').length;
    setNewOrdersSidebarBadge(newCount);
  } catch (error) {
    setNewOrdersSidebarBadge(0);
  }
}

function updateStats(rows) {
  const list = Array.isArray(rows) ? rows : [];
  const total = list.length;
  const valid = list.filter((item) => String(item.status || '').toUpperCase() === 'ACTIVE').length;
  const deactivated = list.filter((item) => String(item.status || '').toUpperCase() !== 'ACTIVE').length;
  const inUse = list.reduce((sum, item) => sum + Number(item.activationsCount || 0), 0);

  const statTotal = document.getElementById('statTotal');
  const statValid = document.getElementById('statValid');
  const statInUse = document.getElementById('statInUse');
  const statDeactivated = document.getElementById('statDeactivated');

  if (statTotal) statTotal.textContent = String(total);
  if (statValid) statValid.textContent = String(valid);
  if (statInUse) statInUse.textContent = String(inUse);
  if (statDeactivated) statDeactivated.textContent = String(deactivated);
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.ok) {
    throw new Error((data && data.message) || `Request failed (${response.status}).`);
  }
  return data;
}

async function loadLicenses() {
  const body = document.getElementById('licensesTableBody');
  if (!body) return;
  body.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
  const data = await fetchJson('/api/admin/licenses', { headers: authHeaders() });
  const rows = Array.isArray(data.licenses) ? data.licenses : [];
  if (!rows.length) {
    updateStats([]);
    body.innerHTML = '<tr><td colspan="7">No licenses yet.</td></tr>';
    return;
  }

  updateStats(rows);
  body.innerHTML = rows.map((item) => `
    <tr>
      <td>${escapeHtml(item.customerName || '-')}</td>
      <td>${escapeHtml(item.keyLast4 || '-')}</td>
      <td>${statusBadge(item.status)}</td>
      <td>${item.activationsCount || 0}</td>
      <td>${item.maxDevices || 1}</td>
      <td>${fmtDate(item.createdAt)}</td>
      <td><button class="btn btn-outline-secondary btn-sm" data-action="view" data-id="${item.id}">View</button></td>
    </tr>
  `).join('');

  body.querySelectorAll('[data-action="view"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        const payload = await fetchJson(`/api/admin/licenses/${btn.dataset.id}`, { headers: authHeaders() });
        currentLicense = payload.license;
        renderLicenseDetails(currentLicense);
        licenseModal.show();
      } catch (error) {
        alert(String(error.message || error));
      }
    });
  });
}

async function loadActivations() {
  const body = document.getElementById('activationsTableBody');
  if (!body) return;
  body.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
  const data = await fetchJson('/api/admin/activations', { headers: authHeaders() });
  const rows = Array.isArray(data.activations) ? data.activations : [];
  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="6">No activation data.</td></tr>';
    return;
  }
  body.innerHTML = rows.map((item) => {
    const latestSeen = (item.activations || [])
      .map((a) => a.lastSeenAt || a.activatedAt || '')
      .sort()
      .pop() || '';
    const hardwareList = (item.activations || [])
      .map((a) => shortFingerprint(a.hardwareFingerprint))
      .join('<br/>') || '-';
    return `
      <tr>
        <td>${escapeHtml(item.customerName || '-')}</td>
        <td>${escapeHtml(item.keyLast4 || '-')}</td>
        <td>${statusBadge(item.status)}</td>
        <td>${item.devicesBound || 0} / ${item.maxDevices || 1}</td>
        <td>${hardwareList}</td>
        <td>${fmtDate(latestSeen)}</td>
      </tr>
    `;
  }).join('');
}

async function loadDevices() {
  const body = document.getElementById('devicesTableBody');
  if (!body) return;
  body.innerHTML = '<tr><td colspan="8">Loading...</td></tr>';
  const data = await fetchJson('/api/admin/devices', { headers: authHeaders() });
  const rows = Array.isArray(data.devices) ? data.devices : [];
  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="8">No device history.</td></tr>';
    return;
  }
  body.innerHTML = rows.map((item) => `
    <tr>
      <td>${escapeHtml(item.customerName || '-')}</td>
      <td>${escapeHtml(item.keyLast4 || '-')}</td>
      <td>${escapeHtml(item.deviceName || '-')}</td>
      <td title="${escapeHtml(item.hardwareFingerprint || '-')}">${escapeHtml(shortFingerprint(item.hardwareFingerprint))}</td>
      <td>${escapeHtml(item.firstSeenIp || '-')}</td>
      <td>${escapeHtml(item.lastSeenIp || '-')}</td>
      <td>${fmtDate(item.activatedAt)}</td>
      <td>${fmtDate(item.lastSeenAt)}</td>
    </tr>
  `).join('');
}

async function loadOrders() {
  const body = document.getElementById('ordersTableBody');
  if (!body) return;
  body.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
  const data = await fetchJson('/api/admin/orders', { headers: authHeaders() });
  const rows = Array.isArray(data.orders) ? data.orders : [];
  const newCount = rows.filter((item) => String(item.status || '').toUpperCase() === 'NEW').length;
  setNewOrdersSidebarBadge(newCount);
  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="7">No orders yet.</td></tr>';
    return;
  }
  body.innerHTML = rows.map((item) => `
    <tr>
      <td>${escapeHtml(item.fullName || `${item.firstName || ''} ${item.lastName || ''}`.trim() || '-')}</td>
      <td>${escapeHtml(item.email || '-')}</td>
      <td>${escapeHtml(item.phone || '-')}</td>
      <td>${statusBadge(item.status)}</td>
      <td>${fmtDate(item.createdAt)}</td>
      <td>${Array.isArray(item.responses) ? item.responses.length : 0}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary" data-action="respond-order" data-id="${escapeHtml(item.id)}">Respond</button>
      </td>
    </tr>
  `).join('');
  body.querySelectorAll('[data-action="respond-order"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const order = rows.find((row) => String(row.id) === String(btn.dataset.id));
      if (!order) return;
      openOrderResponseModal(order);
    });
  });
}

async function loadBlogs() {
  const body = document.getElementById('blogTableBody');
  if (!body) return;
  body.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
  const data = await fetchJson('/api/admin/blogs', { headers: authHeaders() });
  const rows = Array.isArray(data.posts) ? data.posts : [];
  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="4">No posts yet.</td></tr>';
    return;
  }
  body.innerHTML = rows.map((item) => `
    <tr>
      <td>${escapeHtml(item.title || '-')}</td>
      <td>${blogStatusBadge(item.status)}</td>
      <td>${fmtDate(item.updatedAt || item.createdAt)}</td>
      <td class="d-flex gap-2">
        <button class="btn btn-sm btn-outline-primary" data-action="edit-blog" data-id="${escapeHtml(item.id)}">Edit</button>
        <button class="btn btn-sm btn-outline-danger" data-action="delete-blog" data-id="${escapeHtml(item.id)}">Delete</button>
      </td>
    </tr>
  `).join('');
  body.querySelectorAll('[data-action="edit-blog"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const row = rows.find((r) => String(r.id) === String(btn.dataset.id));
      if (!row) return;
      document.getElementById('blogPostId').value = row.id || '';
      document.getElementById('blogTitle').value = row.title || '';
      document.getElementById('blogCategory').value = row.category || '';
      document.getElementById('blogReadTime').value = String(row.readingMinutes || 5);
      document.getElementById('blogCoverUrl').value = row.coverImageUrl || '';
      document.getElementById('blogSummary').value = row.summary || '';
      blogEditor?.setHTML(row.contentHtml || '');
      const wc = document.getElementById('blogWordCount');
      if (wc) {
        const text = String(blogEditor?.getText() || '').trim();
        const words = text ? text.split(/\s+/).length : 0;
        wc.textContent = `${words} words`;
      }
      document.getElementById('blogStatus').value = String(row.status || 'DRAFT').toUpperCase() === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
      document.getElementById('blogResult').textContent = 'Editing post...';
    });
  });
  body.querySelectorAll('[data-action="delete-blog"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!window.confirm('Delete this post?')) return;
      try {
        await fetchJson(`/api/admin/blogs/${encodeURIComponent(btn.dataset.id || '')}`, {
          method: 'DELETE',
          headers: authHeaders()
        });
        await loadBlogs();
      } catch (error) {
        alert(String(error.message || error));
      }
    });
  });
}

function openOrderResponseModal(order) {
  currentOrder = order;
  const customer = document.getElementById('orderModalCustomer');
  const email = document.getElementById('orderModalEmail');
  const phone = document.getElementById('orderModalPhone');
  const subject = document.getElementById('orderResponseSubject');
  const activationKey = document.getElementById('orderResponseKey');
  const message = document.getElementById('orderResponseMessage');
  const result = document.getElementById('orderResponseResult');
  const history = document.getElementById('orderResponseHistory');

  if (customer) customer.textContent = order.fullName || `${order.firstName || ''} ${order.lastName || ''}`.trim() || '-';
  if (email) email.textContent = order.email || '-';
  if (phone) phone.textContent = order.phone || '-';
  if (subject) subject.value = `Your Officino Activation Key`;
  if (activationKey) activationKey.value = '';
  if (message) {
    message.value = `Hello ${order.firstName || order.fullName || ''},\n\nThank you for your order.\n\nPlease contact support if you need setup help.\n\nBest regards,\nOfficino Support`;
  }
  if (result) {
    result.className = 'small mt-2';
    result.textContent = '';
  }
  if (history) {
    const responses = Array.isArray(order.responses) ? order.responses : [];
    if (!responses.length) {
      history.textContent = 'No responses yet.';
    } else {
      history.innerHTML = responses.map((entry) => `
        <div class="history-item">
          <div><strong>${escapeHtml(entry.subject || '-')}</strong></div>
          <div>${escapeHtml(fmtDate(entry.createdAt))} · ${escapeHtml(entry.adminUser || 'admin')}</div>
          <div><strong>Email:</strong> ${escapeHtml(entry.emailStatus || 'PENDING')}</div>
          <div>${escapeHtml(entry.activationKey || '-')}</div>
          ${entry.emailError ? `<div class="text-danger">${escapeHtml(entry.emailError)}</div>` : ''}
          <div>${escapeHtml(entry.message || '-')}</div>
        </div>
      `).join('');
    }
  }
  orderResponseModal.show();
}

async function loadLogs() {
  const body = document.getElementById('logsTableBody');
  const level = String(document.getElementById('logLevelFilter')?.value || '').trim();
  if (!body) return;
  body.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
  const query = new URLSearchParams();
  if (level) query.set('level', level);
  query.set('limit', '300');
  const data = await fetchJson(`/api/admin/logs?${query.toString()}`, { headers: authHeaders() });
  const rows = Array.isArray(data.logs) ? data.logs : [];
  const pathEl = document.getElementById('serverLogPath');
  if (pathEl) {
    pathEl.textContent = data.logFilePath ? `Log file: ${data.logFilePath}` : '-';
  }
  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="4">No logs found.</td></tr>';
    return;
  }
  body.innerHTML = rows.map((row) => `
    <tr>
      <td>${fmtDate(row.ts)}</td>
      <td>${escapeHtml(row.level || '-')}</td>
      <td>${escapeHtml(row.message || '-')}</td>
      <td><pre class="mb-0 small">${escapeHtml(row.meta ? JSON.stringify(row.meta, null, 2) : '-')}</pre></td>
    </tr>
  `).join('');
}

function renderLicenseDetails(license) {
  document.getElementById('dCustomer').textContent = license.customerName || '-';
  document.getElementById('dStatus').textContent = license.status || '-';
  document.getElementById('dKey').textContent = license.activationKey || '-';
  document.getElementById('dMax').textContent = String(license.maxDevices || 1);
  document.getElementById('dCreated').textContent = fmtDate(license.createdAt);
  document.getElementById('dNotes').textContent = license.notes || '-';

  const deviceRows = document.getElementById('deviceRows');
  if (!deviceRows) return;
  const rows = Array.isArray(license.activations) ? license.activations : [];
  if (!rows.length) {
    deviceRows.innerHTML = '<tr><td colspan="7">No activated devices yet.</td></tr>';
    return;
  }
  deviceRows.innerHTML = rows.map((a) => `
    <tr>
      <td>${a.deviceName || '-'}</td>
      <td title="${a.hardwareFingerprint || '-'}">${shortFingerprint(a.hardwareFingerprint)}</td>
      <td>${a.firstSeenIp || '-'}</td>
      <td>${a.lastSeenIp || '-'}</td>
      <td>${fmtDate(a.activatedAt)}</td>
      <td>${fmtDate(a.lastSeenAt)}</td>
      <td><button class="btn btn-outline-danger btn-sm" data-action="unbind-device" data-device-id="${a.hardwareFingerprint || ''}">Unbind</button></td>
    </tr>
  `).join('');

  deviceRows.querySelectorAll('[data-action="unbind-device"]').forEach((btn) => {
    btn.addEventListener('click', () => unbindDevice(btn.dataset.deviceId));
  });
}

async function unbindDevice(deviceId) {
  if (!currentLicense || !currentLicense.id || !deviceId) return;
  if (!window.confirm('Unbind this device from the key?')) return;
  try {
    await fetchJson(`/api/admin/licenses/${currentLicense.id}/unbind`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ hardwareFingerprint: deviceId })
    });
    const payload = await fetchJson(`/api/admin/licenses/${currentLicense.id}`, { headers: authHeaders() });
    currentLicense = payload.license;
    renderLicenseDetails(currentLicense);
    await loadCurrentPage();
  } catch (error) {
    alert(String(error.message || error));
  }
}

async function loadCurrentPage() {
  if (currentPage === 'licenses') return loadLicenses();
  if (currentPage === 'activations') return loadActivations();
  if (currentPage === 'orders') return loadOrders();
  if (currentPage === 'blog') return loadBlogs();
  if (currentPage === 'devices') return loadDevices();
  if (currentPage === 'logs') return loadLogs();
  return loadLicenses();
}

function setCurrentPage(page) {
  currentPage = page;
  document.querySelectorAll('[data-page]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.page === currentPage);
  });
  setAuthenticatedUi(true);
  loadCurrentPage().catch((error) => alert(String(error.message || error)));
}

async function openAdminPanel() {
  setAuthenticatedUi(true);
  refreshNewOrdersBadge();
  setCurrentPage(currentPage || 'licenses');
}

function bindAuth() {
  const usernameInput = document.getElementById('adminUsernameInput');
  const passwordInput = document.getElementById('adminPasswordInput');
  const form = document.getElementById('adminLoginForm');
  const authResult = document.getElementById('adminAuthResult');
  const loginBtn = document.getElementById('adminLoginBtn');
  if (!usernameInput || !passwordInput || !form || !authResult || !loginBtn) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = (usernameInput.value || '').trim();
    const password = passwordInput.value || '';
    if (!username || !password) {
      authResult.textContent = 'Username and password are required.';
      return;
    }
    authResult.textContent = '';
    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing in...';
    try {
      const payload = await fetchJson('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      setAdminToken(payload.token);
      passwordInput.value = '';
      await openAdminPanel();
    } catch (error) {
      clearAdminToken();
      setAuthenticatedUi(false);
      authResult.textContent = String(error.message || error);
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = 'Sign In';
    }
  });
}

function bindToolbar() {
  document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
    clearAdminToken();
    setAuthenticatedUi(false);
    const usernameInput = document.getElementById('adminUsernameInput');
    const passwordInput = document.getElementById('adminPasswordInput');
    if (usernameInput) usernameInput.focus();
    if (passwordInput) passwordInput.value = '';
  });
  document.getElementById('refreshLicensesBtn')?.addEventListener('click', () => loadLicenses().catch((error) => alert(String(error.message || error))));
  document.getElementById('refreshActivationsBtn')?.addEventListener('click', () => loadActivations().catch((error) => alert(String(error.message || error))));
  document.getElementById('refreshOrdersBtn')?.addEventListener('click', () => loadOrders().catch((error) => alert(String(error.message || error))));
  document.getElementById('refreshDevicesBtn')?.addEventListener('click', () => loadDevices().catch((error) => alert(String(error.message || error))));
  document.getElementById('refreshBlogBtn')?.addEventListener('click', () => loadBlogs().catch((error) => alert(String(error.message || error))));
  document.getElementById('refreshLogsBtn')?.addEventListener('click', () => loadLogs().catch((error) => alert(String(error.message || error))));
  document.getElementById('logLevelFilter')?.addEventListener('change', () => loadLogs().catch((error) => alert(String(error.message || error))));
  document.getElementById('openManagerBtn')?.addEventListener('click', () => {
    const alertBox = document.getElementById('adminCreateResult');
    if (alertBox) {
      alertBox.classList.add('d-none');
      alertBox.textContent = '';
    }
    managerModal.show();
  });
}

function bindBlogForm() {
  const form = document.getElementById('blogForm');
  const result = document.getElementById('blogResult');
  const htmlField = document.getElementById('blogContentHtml');
  const wordCount = document.getElementById('blogWordCount');
  if (!form || !result) return;
  const updateWordCount = () => {
    if (!blogEditor || !wordCount) return;
    const text = String(blogEditor.getText() || '').trim();
    const words = text ? text.split(/\s+/).length : 0;
    wordCount.textContent = `${words} words`;
  };
  document.querySelectorAll('#blogEditorToolbar [data-editor-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = String(btn.getAttribute('data-editor-action') || '');
      if (!blogEditor) return;
      if (action === 'h1') blogEditor.setHeading(1);
      else if (action === 'h2') blogEditor.setHeading(2);
      else if (action === 'h3') blogEditor.setHeading(3);
      else if (action === 'bold') blogEditor.toggleBold();
      else if (action === 'italic') blogEditor.toggleItalic();
      else if (action === 'underline') blogEditor.toggleUnderline();
      else if (action === 'olist') blogEditor.toggleOrderedList();
      else if (action === 'ulist') blogEditor.toggleBulletList();
      else if (action === 'quote') blogEditor.toggleBlockquote();
      else if (action === 'code') blogEditor.toggleCodeBlock();
      else if (action === 'left') blogEditor.setAlign('left');
      else if (action === 'center') blogEditor.setAlign('center');
      else if (action === 'right') blogEditor.setAlign('right');
      else if (action === 'link') {
        const url = window.prompt('Enter URL');
        if (url !== null) blogEditor.setLink(url);
      } else if (action === 'image') {
        document.getElementById('blogInsertImageFile')?.click();
      } else if (action === 'image-url') {
        const url = window.prompt('Paste image URL');
        if (url) blogEditor.insertImage(url.trim());
      } else if (action === 'divider') blogEditor.insertDivider();
      else if (action === 'clear') blogEditor.clearFormatting();
      else if (action === 'undo') blogEditor.undo();
      else if (action === 'redo') blogEditor.redo();
    });
  });
  document.getElementById('blogInsertImageFile')?.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      const payload = await fetchJson('/api/admin/blogs/upload-image', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ dataUrl })
      });
      const url = payload.url || '';
      if (!url) return;
      const coverField = document.getElementById('blogCoverUrl');
      if (coverField && !coverField.value.trim()) coverField.value = url;
      blogEditor?.insertImage(url);
      updateWordCount();
    } catch (error) {
      result.className = 'small mt-2 text-danger';
      result.textContent = String(error.message || error);
    } finally {
      event.target.value = '';
    }
  });
  document.getElementById('blogCoverInput')?.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      const payload = await fetchJson('/api/admin/blogs/upload-image', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ dataUrl })
      });
      const url = payload.url || '';
      if (!url) return;
      const coverField = document.getElementById('blogCoverUrl');
      if (coverField) coverField.value = url;
      result.className = 'small mt-2 text-success';
      result.textContent = 'Cover image uploaded.';
    } catch (error) {
      result.className = 'small mt-2 text-danger';
      result.textContent = String(error.message || error);
    } finally {
      event.target.value = '';
    }
  });
  document.getElementById('blogResetBtn')?.addEventListener('click', () => {
    form.reset();
    document.getElementById('blogPostId').value = '';
    document.getElementById('blogCoverUrl').value = '';
    document.getElementById('blogReadTime').value = '5';
    blogEditor?.clear();
    if (htmlField) htmlField.value = '';
    updateWordCount();
    result.className = 'small mt-2 text-muted';
    result.textContent = '';
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = (document.getElementById('blogPostId')?.value || '').trim();
    const contentHtml = String(blogEditor?.getHTML() || '').trim();
    if (htmlField) htmlField.value = contentHtml;
    const payload = {
      title: document.getElementById('blogTitle')?.value?.trim() || '',
      category: document.getElementById('blogCategory')?.value?.trim() || '',
      summary: document.getElementById('blogSummary')?.value?.trim() || '',
      contentHtml,
      coverImageUrl: document.getElementById('blogCoverUrl')?.value?.trim() || '',
      readingMinutes: Number(document.getElementById('blogReadTime')?.value || 5),
      status: document.getElementById('blogStatus')?.value || 'DRAFT'
    };
    if (!payload.title || !payload.summary || !payload.contentHtml) {
      result.className = 'small mt-2 text-danger';
      result.textContent = 'Title, summary, and content are required.';
      return;
    }
    try {
      if (id) {
        await fetchJson(`/api/admin/blogs/${encodeURIComponent(id)}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(payload)
        });
      } else {
        await fetchJson('/api/admin/blogs', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload)
        });
      }
      form.reset();
      document.getElementById('blogPostId').value = '';
      blogEditor?.clear();
      updateWordCount();
      result.className = 'small mt-2 text-success';
      result.textContent = 'Post saved successfully.';
      await loadBlogs();
    } catch (error) {
      result.className = 'small mt-2 text-danger';
      result.textContent = String(error.message || error);
    }
  });
  if (blogEditor && typeof blogEditor.onUpdate === 'function') {
    blogEditor.onUpdate(updateWordCount);
  }
  updateWordCount();
}

function initBlogEditor() {
  const editorRoot = document.getElementById('blogContentEditor');
  if (!editorRoot || !window.OfficinoTipTapBundle || typeof window.OfficinoTipTapBundle.createEditor !== 'function') return;
  if (blogEditor) return;
  const updateWordCount = () => {
    const wordCount = document.getElementById('blogWordCount');
    if (!blogEditor || !wordCount) return;
    const text = String(blogEditor.getText() || '').trim();
    const words = text ? text.split(/\s+/).length : 0;
    wordCount.textContent = `${words} words`;
  };
  blogEditor = window.OfficinoTipTapBundle.createEditor({
    element: editorRoot,
    onUpdate: updateWordCount
  });
  updateWordCount();
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read image.'));
    reader.readAsDataURL(file);
  });
}

function bindSidebarNav() {
  document.querySelectorAll('[data-page]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setCurrentPage(btn.dataset.page || 'licenses');
    });
  });
}

function bindCreateForm() {
  const form = document.getElementById('createLicenseForm');
  const resultBox = document.getElementById('adminCreateResult');
  if (!form || !resultBox) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
      customerName: document.getElementById('customerName')?.value?.trim() || '',
      maxDevices: Number(document.getElementById('maxDevices')?.value || 1),
      notes: document.getElementById('notes')?.value?.trim() || ''
    };
    try {
      const data = await fetchJson('/api/admin/licenses', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
      resultBox.classList.remove('d-none', 'alert-danger');
      resultBox.classList.add('alert-success');
      resultBox.textContent = `New key generated: ${data.activationKey}`;
      await loadLicenses();
      form.reset();
      document.getElementById('maxDevices').value = '1';
    } catch (error) {
      resultBox.classList.remove('d-none', 'alert-success');
      resultBox.classList.add('alert-danger');
      resultBox.textContent = String(error.message || error);
    }
  });
}

function bindLicenseActions() {
  document.getElementById('deactivateLicenseBtn')?.addEventListener('click', async () => {
    if (!currentLicense || !currentLicense.id) return;
    if (!window.confirm('Deactivate this key?')) return;
    try {
      await fetchJson(`/api/admin/licenses/${currentLicense.id}/deactivate`, {
        method: 'POST',
        headers: authHeaders()
      });
      licenseModal.hide();
      await loadCurrentPage();
    } catch (error) {
      alert(String(error.message || error));
    }
  });

  document.getElementById('activateLicenseBtn')?.addEventListener('click', async () => {
    if (!currentLicense || !currentLicense.id) return;
    if (!window.confirm('Activate this key?')) return;
    try {
      await fetchJson(`/api/admin/licenses/${currentLicense.id}/activate`, {
        method: 'POST',
        headers: authHeaders()
      });
      licenseModal.hide();
      await loadCurrentPage();
    } catch (error) {
      alert(String(error.message || error));
    }
  });
}

function bindOrderActions() {
  const responseForm = document.getElementById('orderResponseForm');
  const result = document.getElementById('orderResponseResult');
  if (!responseForm || !result) return;
  responseForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!currentOrder?.id) return;
    const subject = document.getElementById('orderResponseSubject')?.value?.trim() || '';
    const message = document.getElementById('orderResponseMessage')?.value?.trim() || '';
    const activationKey = document.getElementById('orderResponseKey')?.value?.trim() || '';
    if (!subject || !message || !activationKey) {
      result.className = 'small mt-2 text-danger';
      result.textContent = 'Subject, message, and activation key are required.';
      return;
    }
    const saveBtn = document.getElementById('orderSaveResponseBtn');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Sending...';
    }
    try {
      const payload = await fetchJson(`/api/admin/orders/${encodeURIComponent(currentOrder.id)}/respond`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ subject, message, activationKey })
      });
      if (String(payload.emailStatus || '').toUpperCase() === 'SENT') {
        result.className = 'small mt-2 text-success';
        result.textContent = 'Response saved and email sent successfully.';
      } else {
        result.className = 'small mt-2 text-warning';
        result.textContent = `Response saved, but email was not sent: ${payload.emailError || 'SMTP error.'}`;
      }
      await loadOrders();
    } catch (error) {
      result.className = 'small mt-2 text-danger';
      result.textContent = String(error.message || error);
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Send Email';
      }
    }
  });
}

function initModals() {
  managerModal = new bootstrap.Modal(document.getElementById('managerModal'));
  licenseModal = new bootstrap.Modal(document.getElementById('licenseModal'));
  orderResponseModal = new bootstrap.Modal(document.getElementById('orderResponseModal'));
  document.getElementById('closeManagerModalBtn')?.addEventListener('click', () => managerModal.hide());
  document.getElementById('closeLicenseModalBtn')?.addEventListener('click', () => licenseModal.hide());
  document.getElementById('closeOrderResponseModalBtn')?.addEventListener('click', () => orderResponseModal.hide());
}

async function resumeSession() {
  const token = getAdminToken();
  if (!token) return false;
  try {
    await fetchJson('/api/admin/session', { headers: authHeaders() });
    await openAdminPanel();
    return true;
  } catch (error) {
    clearAdminToken();
    setAuthenticatedUi(false);
    return false;
  }
}

function init() {
  initModals();
  bindAuth();
  bindToolbar();
  bindSidebarNav();
  bindCreateForm();
  initBlogEditor();
  bindBlogForm();
  bindLicenseActions();
  bindOrderActions();
  setAuthenticatedUi(false);
  resumeSession();
}

init();
