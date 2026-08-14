# Admin & Employer Implementation Tasks

This document breaks down the gap analysis into actionable implementation tasks organized by priority phase.

---

## 📋 Task Legend

- **Priority**: 🔴 Critical | 🟡 Important | 🟢 Nice-to-Have
- **Complexity**: High | Medium | Low
- **Status**: ⏳ Not Started | 🚧 In Progress | ✅ Complete
- **Dependencies**: Tasks that must be completed first

---

## Phase 1: Critical Features (Must Have)

### 🔴 Task 1.1: Email Verification
**Priority**: Critical | **Complexity**: Medium | **Status**: ✅ Complete

**Description**: Implement OTP-based email verification for all user types.

**Subtasks**:
- [x] Create email verification form component
- [x] Implement OTP verification API integration (`POST /api/v1/auth/email/verify-otp`)
- [x] Implement OTP resend API integration (`POST /api/v1/auth/email/resend-otp`)
- [x] Add email verification page
- [x] Create email verification service
- [x] Add verification status to auth context
- [x] Handle verification in registration flow

**Files to Create**:
```
src/shared/auth/
  components/EmailVerificationForm.tsx
  pages/EmailVerificationPage.tsx
  services/emailVerification.service.ts
```

**Dependencies**: None

---

### 🔴 Task 1.2: Password Reset Flow
**Priority**: Critical | **Complexity**: Medium | **Status**: ✅ Complete

**Description**: Implement forgot password and reset password functionality.

**Subtasks**:
- [x] Create forgot password form component
- [x] Implement forgot password API integration (`POST /api/v1/auth/forgot-password`)
- [x] Create reset password form component
- [x] Implement reset password API integration (`POST /api/v1/auth/reset-password`)
- [x] Add forgot password page
- [x] Add reset password page
- [x] Create password reset service
- [x] Add password reset routes

**Files to Create**:
```
src/shared/auth/
  components/ForgotPasswordForm.tsx
  components/ResetPasswordForm.tsx
  pages/ForgotPasswordPage.tsx
  pages/ResetPasswordPage.tsx
  services/passwordReset.service.ts
```

**Dependencies**: None

---

### 🔴 Task 1.3: Application Information Requests (Employer)
**Priority**: Critical | **Complexity**: Medium | **Status**: ✅ Complete

**Description**: Allow employers to request additional information from applicants.

**Subtasks**:
- [x] Create information request dialog component
- [x] Implement information request API integration (`POST /api/v1/applications/{jobApplication}/information-requests`)
- [x] Create information request list component
- [x] Implement information request list API integration (`GET /api/v1/applications/{jobApplication}/information-requests`)
- [x] Create information request details component
- [x] Implement information request details API integration (`GET /api/v1/information-requests/{informationRequest}`)
- [x] Implement information request update API integration (`PATCH /api/v1/information-requests/{informationRequest}`)
- [x] Implement information request cancel API integration (`POST /api/v1/information-requests/{informationRequest}/cancel`)
- [x] Add information request service
- [x] Add information request types/interfaces
- [x] Integrate into applicant details page

**Files to Create**:
```
src/features/employer/applicants/
  components/InformationRequestDialog.tsx
  components/InformationRequestList.tsx
  components/InformationRequestDetails.tsx
  services/employerInformationRequests.service.ts
  types/employerInformationRequests.types.ts
```

**Dependencies**: None

---

### 🔴 Task 1.4: Application Internal Notes (Employer)
**Priority**: Critical | **Complexity**: Medium | **Status**: ✅ Complete

**Description**: Allow employers to add private notes about applications.

**Subtasks**:
- [x] Create internal note dialog component
- [x] Implement internal note create API integration (`POST /api/v1/applications/{jobApplication}/internal-notes`)
- [x] Create internal note list component
- [x] Implement internal note list API integration (`GET /api/v1/applications/{jobApplication}/internal-notes`)
- [x] Create internal note details component
- [x] Implement internal note details API integration (`GET /api/v1/application-internal-notes/{note}`)
- [x] Implement internal note update API integration (`PATCH /api/v1/application-internal-notes/{note}`)
- [x] Implement internal note delete API integration (`DELETE /api/v1/application-internal-notes/{note}`)
- [x] Implement internal note revisions API integration (`GET /api/v1/application-internal-notes/{note}/revisions`)
- [x] Add internal note service
- [x] Add internal note types/interfaces
- [x] Integrate into applicant details page

**Files to Create**:
```
src/features/employer/applicants/
  components/InternalNoteDialog.tsx
  components/InternalNoteList.tsx
  components/InternalNoteDetails.tsx
  services/employerInternalNotes.service.ts
  types/employerInternalNotes.types.ts
```

**Dependencies**: None

---

## Phase 2: Important Features (Should Have)

### 🟡 Task 2.1: Company Team Management
**Priority**: Important | **Complexity**: High | **Status**: ✅ Complete

**Description**: Implement complete company team management for employers.

**Subtasks**:
- [x] Create team member list component
- [x] Implement team members API integration (`GET /api/v1/company/members`)
- [x] Create invitation form component
- [x] Implement invitation create API integration (`POST /api/v1/company/invitations`)
- [x] Create invitation list component
- [x] Implement invitation list API integration (`GET /api/v1/company/invitations`)
- [x] Implement invitation resend API integration (`POST /api/v1/company/invitations/{invitation}/resend`)
- [x] Implement invitation revoke API integration (`POST /api/v1/company/invitations/{invitation}/revoke`)
- [x] Create member role update component
- [x] Implement member role update API integration (`PATCH /api/v1/company/members/{user}/role`)
- [x] Create member status update component
- [x] Implement member status update API integration (`PATCH /api/v1/company/members/{user}/status`)
- [x] Create member removal component
- [x] Implement member removal API integration (`DELETE /api/v1/company/members/{user}`)
- [x] Create ownership transfer dialog
- [x] Implement ownership transfer API integration (`POST /api/v1/company/transfer-ownership`)
- [x] Add team management service
- [x] Add team management types/interfaces
- [x] Integrate into company page

**Files to Create**:
```
src/features/employer/company/
  components/TeamMemberList.tsx
  components/InvitationForm.tsx
  components/InvitationList.tsx
  components/MemberRoleDialog.tsx
  components/MemberStatusDialog.tsx
  components/TransferOwnershipDialog.tsx
  services/employerTeam.service.ts
  types/employerTeam.types.ts
```

**Dependencies**: None

---

### 🟡 Task 2.2: Video Interview Sessions
**Priority**: Important | **Complexity**: High | **Status**: ✅ Complete

**Description**: Integrate LiveKit for video interview sessions.

**Subtasks**:
- [x] Install LiveKit SDK
- [x] Create video session setup component
- [x] Implement video session API integration (`POST /api/v1/interviews/{interview}/video-session`)
- [x] Create video room component
- [x] Implement LiveKit room connection
- [x] Add video controls (mute, camera, screen share)
- [x] Add video recording functionality
- [x] Handle video session errors
- [x] Add video session types/interfaces
- [x] Integrate into interview details page

**Files to Create**:
```
src/features/employer/interviews/
  components/VideoSessionSetup.tsx
  components/VideoInterviewRoom.tsx
  types/videoInterview.types.ts
```

**Dependencies**: None

---

### 🟡 Task 2.3: Interview Evaluation
**Priority**: Important | **Complexity**: Medium | **Status**: ✅ Complete

**Description**: Implement complete interview evaluation workflow.

**Subtasks**:
- [x] Create evaluation form component
- [x] Implement interview complete API integration (`POST /api/v1/interviews/{interview}/complete`)
- [x] Implement interview evaluate API integration (`POST /api/v1/interviews/{interview}/evaluate`)
- [x] Create attendance dialog component
- [x] Implement attendance API integration (`PUT /api/v1/interviews/{interview}/attendance`)
- [x] Create no-show dialog component
- [x] Implement no-show API integration (`POST /api/v1/interviews/{interview}/no-show`)
- [x] Create status history component
- [x] Implement status history API integration (`GET /api/v1/interviews/{interview}/status-history`)
- [x] Create schedule history component
- [x] Implement schedule history API integration (`GET /api/v1/interviews/{interview}/schedule-history`)
- [x] Add evaluation types/interfaces
- [x] Integrate into interview details page

**Files to Create**:
```
src/features/employer/interviews/
  components/EvaluationForm.tsx
  components/AttendanceDialog.tsx
  components/NoShowDialog.tsx
  components/StatusHistory.tsx
  components/ScheduleHistory.tsx
  types/interviewEvaluation.types.ts
```

**Dependencies**: None

---

### 🟡 Task 2.4: Test Retake Policy Management
**Priority**: Important | **Complexity**: Medium | **Status**: ✅ Complete

**Description**: Implement test retake policy configuration.

**Subtasks**:
- [x] Create retake policy dialog component
- [x] Implement retake policy update API integration (`PATCH /api/v1/test-assignments/{applicationTestAssignment}/retake-policy`)
- [x] Create retake grant dialog component
- [x] Implement retake grant API integration (`POST /api/v1/test-assignments/{applicationTestAssignment}/retake`)
- [x] Create attempt series component
- [x] Implement attempt series API integration (`GET /api/v1/test-assignments/{applicationTestAssignment}/attempt-series`)
- [x] Add retake policy types/interfaces
- [x] Integrate into test assignment components

**Files to Create**:
```
src/features/employer/tests/
  components/RetakePolicyDialog.tsx
  components/RetakeGrantDialog.tsx
  components/AttemptSeries.tsx
  types/testRetake.types.ts
```

**Dependencies**: None

---

### 🟡 Task 2.5: Test Deadline Management
**Priority**: Important | **Complexity**: Medium | **Status**: ✅ Complete

**Description**: Implement test deadline extension and history.

**Subtasks**:
- [x] Create deadline extension dialog component
- [x] Implement deadline update API integration (`PATCH /api/v1/test-assignments/{applicationTestAssignment}/deadline`)
- [x] Create deadline history component
- [x] Implement deadline history API integration (`GET /api/v1/test-assignments/{applicationTestAssignment}/deadline-history`)
- [x] Add deadline types/interfaces
- [x] Integrate into test assignment components

**Files to Create**:
```
src/features/employer/tests/
  components/DeadlineExtensionDialog.tsx
  components/DeadlineHistory.tsx
  types/testDeadline.types.ts
```

**Dependencies**: None

---

### 🟡 Task 2.6: Job Screening Questions
**Priority**: Important | **Complexity**: Medium | **Status**: ✅ Complete

**Description**: Implement job screening questions management.

**Subtasks**:
- [x] Create screening question form component
- [x] Implement screening question create API integration (`POST /api/v1/jobs/{jobPosting}/screening-questions`)
- [x] Implement screening question update API integration (`PUT /api/v1/jobs/{jobPosting}/screening-questions/{question}`)
- [x] Implement screening question delete API integration (`DELETE /api/v1/jobs/{jobPosting}/screening-questions/{question}`)
- [x] Add screening question types/interfaces
- [x] Integrate into job form

**Files to Create**:
```
src/features/employer/jobs/
  components/ScreeningQuestionForm.tsx
  components/ScreeningQuestionList.tsx
  types/screeningQuestions.types.ts
```

**Dependencies**: None

---

### 🟡 Task 2.7: Admin Company Member Management
**Priority**: Important | **Complexity**: Medium | **Status**: ✅ Complete

**Description**: Allow admins to manage company members directly.

**Subtasks**:
- [x] Create company member list component (admin)
- [x] Implement company members API integration (`GET /api/v1/admin/companies/{company}/members`)
- [x] Create company invitation dialog (admin)
- [x] Implement company invitation API integration (`POST /api/v1/admin/companies/{company}/invitations`)
- [x] Create member role update component (admin)
- [x] Implement member role update API integration (`PATCH /api/v1/admin/companies/{company}/members/{user}/role`)
- [x] Add admin company member types/interfaces
- [x] Integrate into admin company details page

**Files to Create**:
```
src/features/admin/companies/
  components/CompanyMemberList.tsx
  components/CompanyInvitationDialog.tsx
  components/CompanyMemberRoleDialog.tsx
  types/adminCompanyMembers.types.ts
```

**Dependencies**: None

---

### 🟡 Task 2.8: Logout All Sessions
**Priority**: Important | **Complexity**: Low | **Status**: ✅ Complete

**Description**: Add logout from all devices functionality.

**Subtasks**:
- [x] Implement logout all API integration (`POST /api/v1/auth/logout-all`)
- [x] Add logout all button to profile/settings
- [x] Add confirmation dialog
- [x] Handle logout all response

**Files to Modify**:
```
src/shared/auth/services/auth.service.ts
src/features/admin/profile/pages/AdminProfilePage.tsx
src/features/employer/profile/pages/EmployerProfilePage.tsx
```

**Dependencies**: None

---

## Phase 3: Nice-to-Have Features (Could Have)

### 🟢 Task 3.1: Activity Feed
**Priority**: Nice-to-Have | **Complexity**: Low | **Status**: ✅ Complete

**Description**: Display user activity feed.

**Subtasks**:
- [x] Create activity feed component
- [x] Implement activity API integration (`GET /api/v1/activity`)
- [x] Add activity types/interfaces
- [x] Integrate into dashboard

**Files to Create**:
```
src/features/admin/users/
  components/ActivityFeed.tsx
src/features/employer/dashboard/
  components/ActivityFeed.tsx
types/activity.types.ts
```

**Dependencies**: None

---

### 🟢 Task 3.2: Public Company Pages
**Priority**: Nice-to-Have | **Complexity**: Medium | **Status**: ✅ Complete

**Description**: Create public-facing company profile pages.

**Subtasks**:
- [x] Create public company page component
- [x] Implement public company API integration (`GET /api/v1/companies/{company}`)
- [x] Create public company jobs component
- [x] Implement public company jobs API integration (`GET /api/v1/companies/{company}/jobs`)
- [x] Add public company types/interfaces
- [x] Add public company routes

**Files to Create**:
```
src/features/public/
  company/
    pages/PublicCompanyPage.tsx
    components/PublicCompanyDetails.tsx
    components/PublicCompanyJobs.tsx
  services/publicCompany.service.ts
  types/publicCompany.types.ts
src/router/PublicRoutes.tsx
```

**Dependencies**: None

---

### 🟢 Task 3.3: ML Job Recommendations
**Priority**: Nice-to-Have | **Complexity**: Low | **Status**: ✅ Complete

**Description**: Display ML-recommended jobs to candidates (admin view).

**Subtasks**:
- [x] Implement recommended jobs API integration (`GET /api/v1/jobs/recommended`)
- [x] Create recommended jobs component for admin
- [x] Add recommendation types/interfaces

**Files to Create**:
```
src/features/admin/jobs/
  components/RecommendedJobs.tsx
  types/jobRecommendations.types.ts
```

**Dependencies**: None

---

### 🟢 Task 3.4: Reference Data Integration
**Priority**: Nice-to-Have | **Complexity**: Low | **Status**: ✅ Complete

**Description**: Integrate reference data APIs (cities, job filters).

**Subtasks**:
- [x] Implement cities API integration (`GET /api/v1/reference/cities`)
- [x] Implement job filters API integration (`GET /api/v1/reference/job-filters`)
- [x] Create reference data service
- [x] Add reference data types/interfaces
- [x] Integrate into forms (location, filters)

**Files to Create**:
```
src/shared/reference/
  services/reference.service.ts
  types/reference.types.ts
```

**Dependencies**: None
---


### 🟢 Task 3.5: Admin Skills Icon Management
**Priority**: Nice-to-Have | **Complexity**: Low | **Status**: ✅ Complete

**Description**: Add skill icon upload/management for admins.

**Subtasks**:
- [x] Create skill icon upload component
- [x] Implement skill icon upload API integration (`POST /api/v1/admin/skills/{skill}/icon`)
- [x] Implement skill icon delete API integration (`DELETE /api/v1/admin/skills/{skill}/icon`)
- [x] Integrate into admin skills page

**Files to Create**:
```
src/features/admin/skills/
  components/SkillIconUpload.tsx
```

**Dependencies**: None

---

## Technical Debt Tasks

### 🔧 Task TD.1: API Type Safety Review
**Priority**: Medium | **Complexity**: Medium | **Status**: ⏳ Not Started

**Description**: Review and ensure all API responses are properly typed.

**Subtasks**:
- [ ] Audit all service files for missing types
- [ ] Add missing TypeScript interfaces
- [ ] Ensure all API calls have proper type definitions
- [ ] Add type guards where needed

---

### 🔧 Task TD.2: Error Handling Review
**Priority**: Medium | **Complexity**: Medium | **Status**: ⏳ Not Started

**Description**: Review and improve error handling across the application.

**Subtasks**:
- [ ] Audit all API calls for proper error handling
- [ ] Add user-friendly error messages
- [ ] Ensure loading states are properly handled
- [ ] Add retry logic for transient errors

---

### 🔧 Task TD.3: Form Validation Review
**Priority**: Medium | **Complexity**: Medium | **Status**: ⏳ Not Started

**Description**: Ensure frontend validations match backend requirements.

**Subtasks**:
- [ ] Review all form validations against backend API requirements
- [ ] Add missing validation rules
- [ ] Update validation schemas (Zod)
- [ ] Test form submissions with invalid data

---

### 🔧 Task TD.4: Localization Review
**Priority**: Low | **Complexity**: Low | **Status**: ✅ Complete

**Description**: Ensure proper localization support.

**Subtasks**:
- [x] Verify `Accept-Language` header is sent with API requests
- [x] Review all hardcoded strings
- [x] Add missing translation keys
- [x] Test language switching

---

### 🔧 Task TD.5: Pagination Review
**Priority**: Low | **Complexity**: Low | **Status**: ⏳ Not Started

**Description**: Ensure all list views implement backend pagination.

**Subtasks**:
- [ ] Audit all list components for pagination
- [ ] Add pagination controls where missing
- [ ] Implement infinite scroll where appropriate
- [ ] Test pagination with large datasets

---

## Task Summary

### Phase 1: Critical (4 tasks)
- Email Verification
- Password Reset Flow
- Application Information Requests
- Application Internal Notes

### Phase 2: Important (8 tasks)
- Company Team Management
- Video Interview Sessions
- Interview Evaluation
- Test Retake Policy Management
- Test Deadline Management
- Job Screening Questions
- Admin Company Member Management
- Logout All Sessions

### Phase 3: Nice-to-Have (5 tasks)
- Activity Feed
- Public Company Pages
- ML Job Recommendations
- Reference Data Integration
- Admin Skills Icon Management

### Technical Debt (5 tasks)
- API Type Safety Review
- Error Handling Review
- Form Validation Review
- Localization Review
- Pagination Review

**Total Tasks: 22**
