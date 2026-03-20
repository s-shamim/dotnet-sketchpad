# API Client — Backend API Specification
ASP.NET Core Minimal API · No implementation required

---

## Base URL
```
/api
```

---

## 1. Collections

### `GET /api/collections`
Returns all saved request collections for the current user.
**Used in:** Sidebar → collections tab (loads the tree on startup)
**Response:**
```json
[
  {
    "id": "col_1",
    "name": "user api",
    "requests": [
      {
        "id": "req_1",
        "name": "/users",
        "method": "GET",
        "url": "https://api.example.com/users",
        "params": [{ "key": "page", "value": "1", "enabled": true }],
        "headers": [{ "key": "Authorization", "value": "Bearer {{api_key}}", "enabled": true }],
        "body": "",
        "bodyType": "none",
        "auth": { "type": "bearer token", "token": "{{api_key}}" }
      }
    ]
  }
]
```

---

### `POST /api/collections`
Creates a new empty collection.
**Used in:** Sidebar → "+ new collection" button
**Request body:**
```json
{ "name": "my collection" }
```
**Response:** `201 Created` with the created collection object.

---

### `PUT /api/collections/{id}`
Renames a collection.
**Used in:** Sidebar → collection name edit (future inline rename)
**Request body:**
```json
{ "name": "updated name" }
```

---

### `DELETE /api/collections/{id}`
Deletes a collection and all its requests.
**Used in:** Sidebar → collection context menu (future)

---

## 2. Requests (within Collections)

### `POST /api/collections/{collectionId}/requests`
Saves a new request into a collection.
**Used in:** "Save request" action (future toolbar button above the URL bar)
**Request body:**
```json
{
  "name": "/users",
  "method": "GET",
  "url": "https://api.example.com/users",
  "params": [],
  "headers": [],
  "body": "",
  "bodyType": "none",
  "auth": { "type": "no auth" }
}
```
**Response:** `201 Created` with the saved request object including its new `id`.

---

### `PUT /api/collections/{collectionId}/requests/{requestId}`
Updates an existing saved request.
**Used in:** "Save" button when an existing collection request is open and modified.
**Request body:** Same shape as POST above.

---

### `DELETE /api/collections/{collectionId}/requests/{requestId}`
Removes a request from a collection.
**Used in:** Sidebar → ✕ on hover over a collection item (future)

---

## 3. Environments

### `GET /api/environments`
Returns all environments with their variables.
**Used in:** Sidebar → env tab (initial load), URL bar env selector, EnvModal (populate tabs).
**Response:**
```json
[
  {
    "id": "env_prod",
    "name": "production",
    "variables": [
      { "key": "base_url", "initialValue": "https://api.example.com", "currentValue": "https://api.example.com" },
      { "key": "api_key", "initialValue": "sk-prod-xxxx", "currentValue": "sk-prod-xxxx" }
    ]
  }
]
```

---

### `POST /api/environments`
Creates a new environment.
**Used in:** EnvModal → "+ new" tab button, Sidebar → "+ add environment".
**Request body:**
```json
{ "name": "local", "variables": [] }
```
**Response:** `201 Created` with the new environment object.

---

### `PUT /api/environments/{id}`
Updates an environment's name and/or variables.
**Used in:** EnvModal → "save" button.
**Request body:**
```json
{
  "name": "production",
  "variables": [
    { "key": "base_url", "initialValue": "https://api.example.com", "currentValue": "https://api.example.com" },
    { "key": "api_key", "initialValue": "sk-prod-xxxx", "currentValue": "sk-prod-xxxx" }
  ]
}
```

---

### `DELETE /api/environments/{id}`
Deletes an environment.
**Used in:** EnvModal → delete button on an env tab (future).

---

## 4. History

### `GET /api/history`
Returns recent request history (last 50), newest first.
**Used in:** Sidebar → history tab (initial load and after each request is sent).
**Response:**
```json
[
  {
    "id": "hist_1",
    "method": "GET",
    "url": "https://api.example.com/users?page=1",
    "status": 200,
    "duration": 142,
    "time": "10:42:01",
    "timestamp": "2025-11-01T10:42:01Z"
  }
]
```

---

### `POST /api/history`
Appends a new entry to history after a request is sent.
**Used in:** Internally after every successful or failed send in `handleSend()`.
**Request body:**
```json
{
  "method": "GET",
  "url": "https://api.example.com/users",
  "status": 200,
  "statusText": "OK",
  "duration": 142,
  "timestamp": "2025-11-01T10:42:01Z"
}
```

---

### `DELETE /api/history`
Clears all history.
**Used in:** Console / history tab clear button (future).

---

## 5. Proxy (Request Execution)

### `POST /api/proxy`
Executes an HTTP request server-side and returns the response. This solves CORS issues when the target API does not allow browser requests.
**Used in:** `handleSend()` in `script.jsx` — replaces the direct `fetch()` call for production use.

**Request body:**
```json
{
  "method": "POST",
  "url": "https://api.example.com/users",
  "headers": {
    "Authorization": "Bearer sk-prod-xxxx",
    "Content-Type": "application/json"
  },
  "body": "{\"name\": \"Jane Doe\"}",
  "timeoutMs": 30000
}
```

**Response:**
```json
{
  "status": 201,
  "statusText": "Created",
  "headers": {
    "content-type": "application/json",
    "x-request-id": "abc123"
  },
  "body": "{\"id\": 5, \"name\": \"Jane Doe\"}",
  "durationMs": 88,
  "sizeBytes": 312
}
```

> **Note:** This is the most critical endpoint. The frontend currently calls `fetch()` directly — swap `handleSend()` to call `POST /api/proxy` instead once this endpoint exists.

---

## 6. User Preferences (optional / future)

### `GET /api/preferences`
Returns persisted UI preferences.
**Used in:** App startup to restore layout, active environment, sidebar state.
**Response:**
```json
{
  "layout": "stacked",
  "sidebarOpen": true,
  "consoleOpen": true,
  "activeEnvironmentId": "env_prod"
}
```

---

### `PUT /api/preferences`
Persists current UI preferences.
**Used in:** Whenever layout, sidebar, console state, or active env changes.
**Request body:** Same shape as GET response above.

---

## Summary Table

| Method | Endpoint | Used in UI |
|--------|----------|------------|
| GET | `/api/collections` | Sidebar — collections tab load |
| POST | `/api/collections` | Sidebar — + new collection |
| PUT | `/api/collections/{id}` | Sidebar — rename collection |
| DELETE | `/api/collections/{id}` | Sidebar — delete collection |
| POST | `/api/collections/{cid}/requests` | Save request button |
| PUT | `/api/collections/{cid}/requests/{rid}` | Update saved request |
| DELETE | `/api/collections/{cid}/requests/{rid}` | Remove request from collection |
| GET | `/api/environments` | Sidebar env tab + URL bar env dropdown |
| POST | `/api/environments` | EnvModal — + new environment |
| PUT | `/api/environments/{id}` | EnvModal — save button |
| DELETE | `/api/environments/{id}` | EnvModal — delete env (future) |
| GET | `/api/history` | Sidebar — history tab load |
| POST | `/api/history` | After every send in handleSend() |
| DELETE | `/api/history` | Clear history (future) |
| POST | `/api/proxy` | handleSend() — executes the actual HTTP request |
| GET | `/api/preferences` | App startup restore state |
| PUT | `/api/preferences` | On any layout/state change |
