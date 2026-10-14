# Jajal Medical - Database Documentation

This document describes the relational database schema (MySQL) for the Medical Case Management System.

## Tables & Schema

### 1. `users` Table
Stores user account details and authorization roles.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `AUTO_INCREMENT`, `PRIMARY KEY` | Unique User Identifier |
| `name` | `VARCHAR(255)` | `NOT NULL` | Full Name of the user |
| `email` | `VARCHAR(255)` | `NOT NULL`, `UNIQUE INDEX` | Login email address |
| `password` | `VARCHAR(255)` | `NOT NULL` | Bcrypted / hashed password |
| `role` | `ENUM('Admin', 'Engineer', 'Viewer')` | `NOT NULL`, `DEFAULT 'Viewer'` | Role for authorization |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Record creation timestamp |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Last modification timestamp |

---

### 2. `cases` Table
Stores implant medical case records.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `AUTO_INCREMENT`, `PRIMARY KEY` | Unique Case Identifier |
| `case_number` | `VARCHAR(50)` | `NOT NULL`, `UNIQUE INDEX` | Unique reference code (e.g., `CASE-0001`) |
| `patient_reference` | `VARCHAR(50)` | `NOT NULL` | Anonymous patient tracking code (e.g. `PAT-98213`) |
| `surgeon_name` | `VARCHAR(255)` | `NOT NULL` | Name of the operating surgeon |
| `implant_type` | `VARCHAR(255)` | `NOT NULL` | Medical device implant category |
| `status` | `ENUM('Draft', 'Planning', 'In Review', 'Approved', 'Completed', 'Cancelled')` | `NOT NULL`, `INDEX` | Workflow status |
| `priority` | `ENUM('Low', 'Medium', 'High')` | `NOT NULL`, `DEFAULT 'Medium'` | Case urgency level |
| `surgery_date` | `DATE` | `NULLABLE` | Scheduled or performed surgery date |
| `created_by` | `BIGINT UNSIGNED` | `NOT NULL`, `FOREIGN KEY -> users(id)` | User who created the case |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Record creation timestamp |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Last modification timestamp |

---

## Entity-Relationship Diagram (ERD)

```
+-----------------------------------+          +------------------------------------+
|               users               |          |               cases                |
+-----------------------------------+          +------------------------------------+
| PK  id (BIGINT)                   |<--------+| PK  id (BIGINT)                    |
|     name (VARCHAR)                |    1   * | UNQ case_number (VARCHAR)          |
| UNQ email (VARCHAR)               |          |     patient_reference (VARCHAR)    |
|     password (VARCHAR)            |          |     surgeon_name (VARCHAR)         |
|     role (ENUM)                   |          |     implant_type (VARCHAR)         |
|     created_at (TIMESTAMP)        |          | IDX status (ENUM)                  |
|     updated_at (TIMESTAMP)        |          |     priority (ENUM)                |
+-----------------------------------+          |     surgery_date (DATE)            |
                                               | FK  created_by (BIGINT UNSIGNED)   |
                                               |     created_at (TIMESTAMP)         |
                                               |     updated_at (TIMESTAMP)         |
                                               +------------------------------------+
```

## Indexes & Constraints
1. **`users.email`**: `UNIQUE INDEX` to enforce distinct login credentials.
2. **`cases.case_number`**: `UNIQUE INDEX` to guarantee no duplicate case tracking numbers exist in the system.
3. **`cases.status`**: `INDEX` to accelerate filtering on dashboard counts and case list filters.
4. **`cases.created_by`**: `FOREIGN KEY` referencing `users(id)` with `ON DELETE RESTRICT` to ensure audit integrity.
