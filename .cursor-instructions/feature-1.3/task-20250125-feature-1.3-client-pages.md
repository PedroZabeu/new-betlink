# Task: Feature 1.3 - Client Pages Implementation Support

**Priority**: HIGH
**Estimated Time**: 2 hours (working in parallel with Claude)
**Start**: Only after Claude begins implementation

## Context
Claude will implement the client dashboard pages with sidebar navigation. You'll work in parallel to test access control, validate UI, and ensure everything works correctly.

## Your Tasks Timeline

### Task 1: Initial Setup (First 15 minutes)

**While Claude creates the layout structure:**

1. **Check and install dependencies**:
   ```bash
   # Check if lucide-react is installed
   npm list lucide-react
   
   # If not installed, run:
   npm install lucide-react
   ```

2. **Verify build still works**:
   ```bash
   npm run dev
   ```

3. **Report status**:
   Create file: `/mnt/c/Users/pedro/Projetos/new-betlink/.claude-instructions/status-dependencies-1.3.md`
   ```markdown
   # Dependencies Status
   - lucide-react: ✅/❌ [version]
   - Build status: ✅/❌
   - Dev server: Running on port ____
   ```

### Task 2: Access Control Testing (Minutes 30-60)

**After Claude creates the basic layout:**

Test access to `/cliente/dashboard` with each user:

| User | Email | Expected Result | Actual Result | Notes |
|------|-------|-----------------|---------------|-------|
| Cliente | newcliente@betlink.com | ✅ Access allowed | | |
| Tipster | newtipster@betlink.com | ✅ Access allowed | | |
| Admin | newadmin@betlink.com | ✅ Access allowed | | |
| Master | newmaster@betlink.com | ✅ Access allowed | | |
| Not logged in | - | ❌ Redirect to /auth/login | | |

**Also test blocked routes:**
- Cliente trying `/tipster/dashboard` → Should redirect to `/access-denied`
- Cliente trying `/admin/dashboard` → Should redirect to `/access-denied`

Document results in: `/mnt/c/Users/pedro/Projetos/new-betlink/.claude-instructions/access-test-results-1.3.md`

### Task 3: Visual Validation (Minutes 60-90)

**Once Claude has components ready:**

1. **Check responsive design**:
   - Desktop (1920x1080): Sidebar visible, proper spacing
   - Tablet (768px): Sidebar still visible or drawer?
   - Mobile (375px): Drawer menu, no horizontal scroll

2. **Verify Portuguese translations**:
   Look for any English text and list them:
   ```markdown
   # English Text Found
   - Page: /cliente/dashboard
   - Text: "Dashboard" 
   - Should be: "Painel"
   ```

3. **Test theme switching**:
   - [ ] Light mode looks good
   - [ ] Dark mode looks good
   - [ ] Theme persists on refresh

### Task 4: Component Testing (Minutes 90-105)

**Test each component behavior:**

1. **SidebarNav**:
   - [ ] Active state matches current page
   - [ ] All links work
   - [ ] Icons display correctly
   - [ ] User info shows at bottom

2. **StatsCard** (if visible):
   - [ ] Numbers display correctly
   - [ ] Icons show
   - [ ] Responsive on mobile

3. **EmptyState** (if visible):
   - [ ] Centered properly
   - [ ] Text readable
   - [ ] Button works (if any)

### Task 5: Integration Testing (Minutes 105-120)

**Complete user journey for each role:**

1. **Login → Navigate → Logout flow**:
   ```
   For each user:
   1. Login at /auth/login
   2. Land on correct dashboard
   3. Navigate to /cliente/dashboard (if not already there)
   4. Click through all sidebar links:
      - Dashboard
      - Assinaturas  
      - Histórico
   5. Verify breadcrumbs update
   6. Test logout from each page
   ```

2. **State persistence**:
   - [ ] Refresh page - still logged in?
   - [ ] Theme preference saved?
   - [ ] Returns to same page after refresh?

### Task 6: Final Report (Last 15 minutes)

Create comprehensive test report at:
`/mnt/c/Users/pedro/Projetos/new-betlink/.claude-instructions/feature-1.3-test-report.md`

```markdown
# Feature 1.3 Test Report

## Summary
- Total tests run: ___
- Passed: ___
- Failed: ___
- Blocked: ___

## Access Control Matrix
[Include your test results table]

## Visual Issues
- [ ] Desktop: 
- [ ] Tablet:
- [ ] Mobile:

## Bugs Found
1. [Description, steps to reproduce]

## English Text Needing Translation
1. [List all]

## Performance
- Page load time: ___
- Navigation feels: Fast/Normal/Slow

## Overall Status
Feature 1.3 is: ✅ Ready / ⚠️ Has issues / ❌ Blocked
```

## Important Notes

### DO NOT MODIFY
- `/lib/auth/*` - Auth logic is working, don't touch
- `/middleware.ts` - Critical for access control
- Any file outside `/app/cliente/*` unless fixing a bug

### FOCUS ON
- Testing access control thoroughly
- Finding visual issues
- Ensuring Portuguese translations
- Validating responsive design

### If You Find Bugs
1. Document exact steps to reproduce
2. Include console errors if any
3. Note which user/role was affected
4. Create status file immediately

## Communication with Claude

### Status Updates
Create files in `.claude-instructions/` folder:
- `status-dependencies-1.3.md` - After setup
- `access-test-results-1.3.md` - After access tests  
- `visual-issues-1.3.md` - If any visual problems
- `feature-1.3-test-report.md` - Final comprehensive report

### If Blocked
If something is preventing you from testing:
```markdown
# BLOCKED: [Brief description]
- What: [What you're trying to do]
- Error: [Exact error message]
- Impact: [What you can't test because of this]
- Need: [What Claude needs to fix]
```

## Success Criteria

By the end, you should have verified:
- ✅ All 4 roles can access client area (except non-authenticated)
- ✅ Unauthorized routes properly blocked
- ✅ UI is responsive on all devices
- ✅ All text is in Portuguese
- ✅ Navigation works smoothly
- ✅ Theme switching works
- ✅ No console errors
- ✅ Logout works from any page

---

**Remember**: Work in parallel with Claude. Don't wait for everything to be done - test incrementally as features become available!