# Missing Admin APIs

This document tracks backend coverage required by admin frontend features. Implement endpoints with admin authorization, paginated collections, ISO 8601 timestamps, and the existing `{ "success": true, "data": ... }` response envelope.

## User details

### Existing endpoint requiring enrichment

`GET /admin/users/:id`

The endpoint exists, but the admin details page needs a complete account view rather than the basic list record.

Required response fields:

```json
{
  "id": 42,
  "name": "Amina Hassan",
  "first_name": "Amina",
  "last_name": "Hassan",
  "email": "amina@example.com",
  "phone": "+966500000000",
  "avatar_url": null,
  "role": "job_seeker",
  "status": "active",
  "email_verified_at": "2026-05-01T08:00:00Z",
  "last_login_at": "2026-06-21T11:20:00Z",
  "last_active_at": "2026-06-21T11:45:00Z",
  "created_at": "2026-04-10T09:00:00Z",
  "updated_at": "2026-06-20T14:00:00Z",
  "date_of_birth": "1995-03-12",
  "gender": "female",
  "locale": "ar",
  "timezone": "Asia/Riyadh",
  "country": "Saudi Arabia",
  "city": "Riyadh",
  "address": "Riyadh",
  "bio": "Product designer",
  "profile_completion": 90,
  "two_factor_enabled": false,
  "failed_login_attempts": 0,
  "password_changed_at": "2026-05-15T12:00:00Z",
  "suspended_at": null,
  "suspension_reason": null,
  "deleted_at": null,
  "company": null,
  "counts": {
    "applications": 12,
    "jobs": 0,
    "interviews": 3,
    "tests": 4,
    "notifications": 8
  }
}
```

Role-specific profile fields can be returned in `job_seeker_profile`, `employer_profile`, or `admin_profile`. Sensitive secrets, password hashes, reset tokens, and authentication tokens must never be returned.

## User activity

### Missing endpoint

`GET /admin/users/:id/activity?page=1&per_page=20&type=`

Purpose: user-generated platform activity such as profile updates, applications, job actions, interview actions, and assessment activity.

Each item should contain:

```json
{
  "id": 9001,
  "type": "application_submitted",
  "action": "Application submitted",
  "description": "Applied to Senior Product Designer",
  "actor_name": "Amina Hassan",
  "ip_address": "203.0.113.10",
  "user_agent": "Mozilla/5.0 ...",
  "metadata": {},
  "created_at": "2026-06-20T10:00:00Z"
}
```

## Administrative audit log

### Missing endpoint

`GET /admin/users/:id/audit-logs?page=1&per_page=20&action=`

Purpose: immutable history of admin actions affecting the account, including role changes, suspension, activation, moderation, edits, and data exports.

Each record must identify the admin actor, action, old values, new values, optional reason, IP address, and timestamp.

## Login history

### Missing endpoint

`GET /admin/users/:id/login-history?page=1&per_page=20&status=`

Required fields: `id`, `status`, `ip_address`, `user_agent`, normalized `device`, approximate `location`, failure reason when applicable, and `created_at`.

Authentication secrets and raw credentials must never be logged or returned.

## Active sessions

### Missing endpoints

- `GET /admin/users/:id/sessions`
- `DELETE /admin/users/:id/sessions/:sessionId`
- `DELETE /admin/users/:id/sessions` to revoke all sessions

Required session fields: `id`, `device`, `ip_address`, approximate `location`, `last_active_at`, `created_at`, and `current`.

Session tokens must never be returned.

## Related user records

### Missing endpoint

`GET /admin/users/:id/related?include=applications,jobs,interviews,tests&page=1&per_page=10`

The response should be role-aware:

- Job seeker: applications, interviews, assigned assessments, saved jobs, and profile/CV status.
- Employer: owned companies, created jobs, received applications, interviews, assessments, and team membership.
- Admin: assigned moderation work and authored audit events.

Each display record should include `id`, `title`, `subtitle`, `status`, and `created_at`, plus a resource type and route identifier.

## Account administration improvements

Existing endpoints:

- `PATCH /admin/users/:id/role`
- `PATCH /admin/users/:id/status`

The status endpoint should accept an optional required-for-suspension `reason` and write an audit event. Recommended request:

```json
{
  "status": "suspended",
  "reason": "Policy review in progress"
}
```

## Frontend compatibility

The API can follow either approach:

1. Embed `activity_logs`, `audit_logs`, `login_history`, `active_sessions`, `applications`, `jobs`, `interviews`, and `tests` in `GET /admin/users/:id` for an initial limited result.
2. Prefer the separate paginated endpoints above for production scale and return only `counts` in the details response. The frontend should then be connected to those endpoints when they become available.

The current frontend consumes embedded arrays from the details response. Until the paginated APIs are available, it displays the basic user record and explicit unavailable states for missing operational data.
