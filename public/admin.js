const STORAGE_KEY = 'officino_admin_token';

let currentLicense = null;
let managerModal = null;
let licenseModal = null;
let currentPage = 'licenses';

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

function setAuthenticatedUi(isAuth) {
  document.getElementById('adminAuthCard')?.classList.toggle('d-none', isAuth);
  document.getElementById('adminListCard')?.classList.toggle('d-none', !isAuth || currentPage !== 'licenses');
  document.getElementById('adminActivationsCard')?.classList.toggle('d-none', !isAuth || currentPage !== 'activations');
  document.getElementById('adminDevicesCard')?.classList.toggle('d-none', !isAuth || currentPage !== 'devices');
  document.getElementById('adminLogsCard')?.classList.toggle('d-none', !isAuth || currentPage !== 'logs');
  document.getElementById('adminSidebar')?.classList.toggle('d-none', !isAuth);
  document.getElementById('adminShell')?.classList.toggle('is-authenticated', isAuth);
}

function statusBadge(status) {
  const normalized = String(status || '').toUpperCase();
  const cls = normalized === 'ACTIVE' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger';
  return `<span class="badge ${cls}">${normalized || '-'}</span>`;
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
      <td>${item.customerName || '-'}</td>
      <td>${item.keyLast4 || '-'}</td>
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
        <td>${item.customerName || '-'}</td>
        <td>${item.keyLast4 || '-'}</td>
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
      <td>${item.customerName || '-'}</td>
      <td>${item.keyLast4 || '-'}</td>
      <td>${item.deviceName || '-'}</td>
      <td title="${item.hardwareFingerprint || '-'}">${shortFingerprint(item.hardwareFingerprint)}</td>
      <td>${item.firstSeenIp || '-'}</td>
      <td>${item.lastSeenIp || '-'}</td>
      <td>${fmtDate(item.activatedAt)}</td>
      <td>${fmtDate(item.lastSeenAt)}</td>
    </tr>
  `).join('');
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
      <td>${row.level || '-'}</td>
      <td>${row.message || '-'}</td>
      <td><pre class="mb-0 small">${row.meta ? JSON.stringify(row.meta, null, 2) : '-'}</pre></td>
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
  document.getElementById('refreshDevicesBtn')?.addEventListener('click', () => loadDevices().catch((error) => alert(String(error.message || error))));
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

function initModals() {
  managerModal = new bootstrap.Modal(document.getElementById('managerModal'));
  licenseModal = new bootstrap.Modal(document.getElementById('licenseModal'));
  document.getElementById('closeManagerModalBtn')?.addEventListener('click', () => managerModal.hide());
  document.getElementById('closeLicenseModalBtn')?.addEventListener('click', () => licenseModal.hide());
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
  bindLicenseActions();
  setAuthenticatedUi(false);
  resumeSession();
}

init();

