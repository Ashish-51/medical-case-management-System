# Jajal Medical - Implant Case Management System

A medical device case management web application for tracking implant cases from draft to completion with full role-based security, interactive dashboard, CRUD operations, REST API client, and automated test suite.

---

## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion animations.
- **Backend**: Node.js & Express REST server (Sanctum Bearer Token emulation).
- **Public API Integration**: Nager.Date Public Holiday API integration for surgery date checks.
- **Documentation & Traceability**: Markdown-based DB Schema (`docs/database.md`), Requirement Traceability Matrix (`docs/traceability.md`), and AWS Deployment Guide (`docs/deployment.md`).

---

## Dummy Credentials for Testing

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@jajalmedical.com` | `admin123` | View, Create, Edit, Change Status, Delete Cases |
| **Engineer** | `engineer@jajalmedical.com` | `engineer123` | View, Create, Edit, Change Status (Cannot Delete) |
| **Viewer** | `viewer@jajalmedical.com` | `viewer123` | View Cases Only (Cannot Create/Edit/Delete) |

*Note: You can also use the preset quick login buttons on the Login screen to switch roles instantly.*

---

## Setup & Running Instructions

### 1. Installation
```bash
# Clone repository
git clone https://github.com/jajal-medical/case-management.git
cd case-management

# Install dependencies
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Launch Application
```bash
# Start development server (Full-stack Express + React on Port 3000)
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## How to Run Automated Feature Tests

The application includes an in-app interactive **Automated Tests** suite that executes real server-side assertions and logs detailed results.

### In-App Test Runner
1. Log into the application as any user or switch to the **Automated Tests** tab in the top navigation.
2. Click **"Run Automated Test Suite"**.
3. Observe live execution logs and pass/fail badges for all 6 mandatory feature tests:
   - `REQ-004`: Valid login succeeds.
   - `REQ-005`: Invalid login is rejected.
   - `REQ-006`: Guest cannot open case pages or APIs (401 / redirect).
   - `REQ-001`: Admin can create a case.
   - `REQ-002`: Creating a case with a duplicate Case Number fails (422).
   - `REQ-003`: Viewer cannot delete a case (403).

### Command-line Linter
```bash
npm run lint
```

---

## REST API Endpoints List

Every response uses a consistent JSON shape:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

| Method | Endpoint | Purpose | Allowed Roles |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/login` | Authenticate user & get Sanctum Bearer token | Anyone |
| `POST` | `/api/logout` | Revoke active token | Logged-in Users |
| `GET` | `/api/me` | Fetch current user session | Logged-in Users |
| `GET` | `/api/cases` | List cases (paginated, search, status & priority filters, sorting) | Admin, Engineer, Viewer |
| `POST` | `/api/cases` | Create a new implant case | Admin, Engineer |
| `GET` | `/api/cases/{id}` | Get details for a single case | Admin, Engineer, Viewer |
| `PUT` | `/api/cases/{id}` | Update case attributes or status | Admin, Engineer |
| `DELETE` | `/api/cases/{id}` | Delete a case | Admin ONLY (403 for Viewer/Engineer) |
| `GET` | `/api/holidays` | Check public holiday status for a given surgery date | Anyone |

---

## Key Design Decisions & Features

1. **Role Enforcement**:
   Server-side middleware strictly enforces policies (`CasePolicy`). Attempting to delete a case as a Viewer or Engineer returns HTTP `403 Forbidden` with a clear JSON error message, regardless of UI state.

2. **Form Request Validation**:
   Validation logic in `StoreCaseRequest` / `UpdateCaseRequest` ensures:
   - Required fields: `case_number`, `patient_reference`, `surgeon_name`, `implant_type`, `status`, `priority`.
   - Unique `case_number` constraint (ignoring current case ID on updates).
   - Allowed values for `status` (`Draft`, `Planning`, `In Review`, `Approved`, `Completed`, `Cancelled`) and `priority` (`Low`, `Medium`, `High`).

3. **Public Holiday API Integration**:
   When scheduling a surgery date, the app checks the public holiday API (Nager.Date). If the chosen date falls on a public holiday, a helpful banner alerts the surgeon/admin to review scheduling conflicts.

4. **REST API Studio**:
   An embedded Postman-like client allowing reviewers to send live HTTP requests, inspect headers, status codes (200, 201, 401, 403, 404, 422), field-level validation errors, and download the full Postman Collection JSON.

---

## Documentation Links
- [Database Schema & ER Diagram (`docs/database.md`)](./docs/database.md)
- [Requirements Traceability Matrix (`docs/traceability.md`)](./docs/traceability.md)
- [AWS Deployment Guide (`docs/deployment.md`)](./docs/deployment.md)

---

## Assumptions & Known Limitations
- **Dummy Data Only**: All patient reference codes (e.g., `PAT-98213`) are synthetic identifiers. No real protected health information (PHI) is stored.
- **Session Tokens**: Sanctum-like stateful bearer tokens are stored in-memory on the server for instant evaluation without external database setup.
