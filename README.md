# Officino Local Server (NanoPi-ready)

This folder contains:
- Download website (`/`)
- Activation API (`/api/activation/*`)
- Admin license API (`/api/admin/*`)

## 1) Install

```bash
cd server
npm install
cp .env.example .env
```

## 2) Configure `.env`

Set at least:
- `PUBLIC_BASE_URL` (your NanoPi IP + port, example `http://10.120.207.155:8080`)
- `ACTIVATION_SIGNING_SECRET` (long random string)
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD` (or better: `ADMIN_PASSWORD_HASH`)
- `DOWNLOAD_WINDOWS_URL`
- `DOWNLOAD_MAC_URL`

Generate a secure password hash (recommended):

```bash
npm run admin:hash -- "YourStrongPassword123!"
```

Then put output into `ADMIN_PASSWORD_HASH` and remove `ADMIN_PASSWORD`.

## 3) Run

```bash
npm start
```

Server will listen on `HOST:PORT` (default `0.0.0.0:8080`).

Website routes:
- End user page: `/`
- Admin page: `/admin`

## 4) Create first license

Use the admin page (`/admin`) to create your first key.

Response includes `activationKey`.

## 4.1) Admin page (sub-admin panel)

Open:
- `http://<PI_IP>:8080/admin`

Use your `ADMIN_USERNAME` + `ADMIN_PASSWORD` to log in and:
- generate activation keys
- view license list
- view full activation key per license
- activate/deactivate a license key

## 5) API summary

- `POST /api/activation/activate`
  - body: `{ activationKey, machineId, deviceName }`
- `POST /api/activation/validate`
  - body: `{ token, machineId }`
- `POST /api/activation/deactivate`
  - body: `{ activationKey, machineId }`

- `POST /api/admin/login` (body: `{ username, password }`)
- `GET /api/admin/session` (requires `Authorization: Bearer <token>`)
- `GET /api/admin/licenses` (requires `Authorization: Bearer <token>`)
- `POST /api/admin/licenses` (requires `Authorization: Bearer <token>`)
- `GET /api/admin/licenses/:id` (requires `Authorization: Bearer <token>`)
- `POST /api/admin/licenses/:id/deactivate` (requires `Authorization: Bearer <token>`)
- `POST /api/admin/licenses/:id/activate` (requires `Authorization: Bearer <token>`)

## 7) Reset all previous keys (clean start)

```bash
npm run reset-data
```

This clears all stored licenses in `DATA_FILE`.

## 6) NanoPi notes

- Open port in firewall/router if needed.
- Start with HTTP in local LAN for development.
- Move to HTTPS + domain/subdomain in production.
