const STORAGE_KEY = 'officino_admin_token';

let currentLicense = null;
let managerModal = null;
let licenseModal = null;

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

function setAuthenticatedUi(isAuth) {
  document.getElementById('adminAuthCard')?.classList.toggle('d-none', isAuth);
  document.getElementById('adminListCard')?.classList.toggle('d-none', !isAuth);
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

async function loadLicenses() {
  const body = document.getElementById('licensesTableBody');
  if (!body) return;
  body.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
  const response = await fetch('/api/admin/licenses', { headers: authHeaders() });
  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error((data && data.message) || 'Failed to load licenses.');
  }
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
        const res = await fetch(`/api/admin/licenses/${btn.dataset.id}`, { headers: authHeaders() });
        const payload = await res.json();
        if (!res.ok || !payload.ok) {
          throw new Error((payload && payload.message) || 'Could not load license details.');
        }
        currentLicense = payload.license;
        renderLicenseDetails(currentLicense);
        licenseModal.show();
      } catch (error) {
        alert(String(error.message || error));
      }
    });
  });
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
    deviceRows.innerHTML = '<tr><td colspan="6">No activated devices yet.</td></tr>';
    return;
  }
  deviceRows.innerHTML = rows.map((a) => `
    <tr>
      <td>${a.deviceName || '-'}</td>
      <td>${a.machineId || '-'}</td>
      <td>${a.firstSeenIp || '-'}</td>
      <td>${a.lastSeenIp || '-'}</td>
      <td>${fmtDate(a.activatedAt)}</td>
      <td>${fmtDate(a.lastSeenAt)}</td>
    </tr>
  `).join('');
}

async function openAdminPanel() {
  setAuthenticatedUi(true);
  await loadLicenses();
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
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok || !payload.token) {
        throw new Error((payload && payload.message) || 'Login failed.');
      }
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
  document.getElementById('refreshLicensesBtn')?.addEventListener('click', async () => {
    try {
      await loadLicenses();
    } catch (error) {
      alert(String(error.message || error));
    }
  });
  document.getElementById('openManagerBtn')?.addEventListener('click', () => {
    const alertBox = document.getElementById('adminCreateResult');
    if (alertBox) {
      alertBox.classList.add('d-none');
      alertBox.textContent = '';
    }
    managerModal.show();
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
      const response = await fetch('/api/admin/licenses', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error((data && data.message) || 'Could not create license.');
      }
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
      const response = await fetch(`/api/admin/licenses/${currentLicense.id}/deactivate`, {
        method: 'POST',
        headers: authHeaders()
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error((data && data.message) || 'Could not deactivate key.');
      }
      licenseModal.hide();
      await loadLicenses();
    } catch (error) {
      alert(String(error.message || error));
    }
  });

  document.getElementById('activateLicenseBtn')?.addEventListener('click', async () => {
    if (!currentLicense || !currentLicense.id) return;
    if (!window.confirm('Activate this key?')) return;
    try {
      const response = await fetch(`/api/admin/licenses/${currentLicense.id}/activate`, {
        method: 'POST',
        headers: authHeaders()
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error((data && data.message) || 'Could not activate key.');
      }
      licenseModal.hide();
      await loadLicenses();
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
    const response = await fetch('/api/admin/session', { headers: authHeaders() });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error((data && data.message) || 'Session expired.');
    }
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
  bindCreateForm();
  bindLicenseActions();
  setAuthenticatedUi(false);
  resumeSession();
}

init();
