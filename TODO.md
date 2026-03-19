# Task: Fix Authentication Verification + Backend CRUD for Login Page Issue

Current Progress: Step 1

## Steps:
- [x] Step 0: Analyzed files, confirmed nav shows link, issue is mock verification + backend bugs
- [x] Step 1: Fix backend/server.js (remove duplicate PUT, add DELETE /api/medicines/:id, add GET /api/verify-batch/:batch using medicines.batch column)
- [ ] Step 2: Test backend CRUD via Inventory page (add/edit/delete medicine) **User to test after backend restart**
- [ ] Step 3: Update src/pages/Authentication.tsx (replace mock handleVerify with fetch('http://localhost:3000/api/verify-batch/...'), use real data)
- [ ] Step 4: Test Authentication verification end-to-end with DB data
- [ ] Step 5: Update TODO.md complete, attempt_completion

**Notes:**
- Backend port 3000, frontend direct fetch (no proxy).
- DB: medicines table with batch column ready.
- No auth needed.

