# Workey Clean Code Baseline

Generated while executing the clean-code roadmap in `cleancode.md`.

## Checks

- `npm run build`: passes.
- `npm run lint -- --quiet`: passes with 0 errors.
- `npm run lint`: passes and reports existing warnings across TypeScript/TSX files.
- `npm run typecheck`: passes after enabling the script and fixing blocking type errors.
- `npm run format:check`: currently fails because many existing files are not Prettier-formatted.

## Confirmed Issues

- `.env` was tracked. It has been removed from Git tracking while the local file remains.
- `package.json` referenced a missing `scripts/check-budgets.js`; the obsolete script reference was removed.
- Existing bundle warnings remain for chunks larger than 500 kB.
- Existing lint warnings remain for `any`, unused symbols, `@ts-nocheck`, Fast Refresh boundaries, and React Hook dependency issues.
- Existing Prettier drift affects many source/config files.

## Largest React/TypeScript Files

- `src/features/employer/interviews/pages/EmployerInterviewDetailsPage.tsx`
- `src/features/employer/jobs/components/EmployerCreateJobWizard.tsx`
- `src/features/employer/applicants/components/ApplicationTestsDialog.tsx`
- `src/features/admin/tests/components/AdminTestWizard.tsx`
- `src/features/employer/tests/components/EmployerTestForm.tsx`
- `src/components/shared/badges/StatusBadge.tsx`
- `src/features/employer/tests/components/QuestionsManager.tsx`

## Next Cleanup Targets

- Run Prettier or format scoped directories to make `npm run format:check` pass.
- Add Vitest and React Testing Library.
- Add MSW and shared test providers.
- Normalize API errors into a shared `AppError`.
- Centralize React Query keys.
- Split large components after tests cover risky behavior.
