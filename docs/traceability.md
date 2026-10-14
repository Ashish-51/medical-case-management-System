# Requirements Traceability Matrix (Medical Software Standards)

This document links product specification requirements to their implementation in code and verification feature tests.

| ID | Requirement (input) | Implementation (output) | Verification |
| :--- | :--- | :--- | :--- |
| **REQ-001** | Admin shall be able to create a case | `CaseController@store` / `POST /api/cases` + `CaseFormModal.tsx` | Feature test: `Admin can create a case` |
| **REQ-002** | Case Number shall be unique | `UNIQUE DB index` + Form Request validation rule (`StoreCaseRequest`) | Feature test: `Creating a case with duplicate Case Number fails (422)` |
| **REQ-003** | Only Admin shall delete cases | `CasePolicy@delete` / `DELETE /api/cases/{id}` middleware check | Feature test: `Viewer cannot delete a case (403)` |
| **REQ-004** | Valid user authentication succeeds | `AuthController@login` / `POST /api/login` | Feature test: `Valid login succeeds` |
| **REQ-005** | Invalid authentication is rejected | `AuthController@login` with 401 error response | Feature test: `Invalid login is rejected` |
| **REQ-006** | Guest cannot open protected case pages or APIs | Auth Token Middleware returning 401 Unauthorized | Feature test: `Guest cannot open case pages or APIs` |
| **REQ-007** | Engineer role can create and edit cases but cannot delete | `CasePolicy@create`, `CasePolicy@update`, `CasePolicy@delete` | Feature test: `Engineer can edit but cannot delete case` |
| **REQ-008** | Case list supports pagination, search, and status/priority filters | `CaseController@index` query scope filtering & pagination | Feature test: `Paginated search and filter query succeeds` |
