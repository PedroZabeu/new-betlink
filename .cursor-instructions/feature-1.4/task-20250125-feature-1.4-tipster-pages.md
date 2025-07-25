# Task: Feature 1.4 - Tipster Pages Implementation Support

**Priority**: HIGH
**Estimated Time**: 1.5 hours (working in parallel with Claude)
**Start**: After Claude creates first layout

## Context
Claude will implement the tipster dashboard pages following the same pattern as Feature 1.3. The middleware already blocks clients from accessing `/tipster/*` routes.

## Your Tasks Timeline

### Task 1: Pre-Implementation Check (First 10 minutes)

**Before Claude starts coding:**

1. **Verify middleware protection exists**:
   ```bash
   # Check line 101-105 in middleware.ts
   grep -n "pathname.startsWith('/tipster')" lib/supabase/middleware.ts
   ```
   
   Expected output should show:
   ```
   if (pathname.startsWith('/tipster') && userRole === 'cliente') {
   ```

2. **Confirm all components from 1.3 are available**:
   - PageHeader ✓
   - StatsCard ✓
   - EmptyState ✓
   - ClientLayout (can be adapted) ✓
   - SidebarNav (can be adapted) ✓

3. **Report initial status**:
   Create file: `/mnt/c/Users/pedro/Projetos/new-betlink/.claude-instructions/feature-1.4/initial-check-1.4.md`
   ```markdown
   # Feature 1.4 Initial Check
   - Middleware tipster protection: ✅/❌
   - Components available: ✅/❌
   - Ready to proceed: Yes/No
   ```

### Task 2: Access Control Testing (Minutes 30-60)

**After Claude creates the basic structure:**

Test access to `/tipster/dashboard` with each user:

| User | Email | Expected Result | Actual Result | Notes |
|------|-------|-----------------|---------------|-------|
| Cliente | newcliente@betlink.com | ❌ Block → /access-denied | | |
| Tipster | newtipster@betlink.com | ✅ Access allowed | | |
| Admin | newadmin@betlink.com | ✅ Access allowed | | |
| Master | newmaster@betlink.com | ✅ Access allowed | | |
| Not logged in | - | ❌ Redirect to /auth/login | | |

**Additional cross-area tests:**
- Tipster trying `/cliente/dashboard` → Should work (tipster can be client too)
- Tipster trying `/admin/dashboard` → Should be blocked → `/access-denied`

Document results in: `/mnt/c/Users/pedro/Projetos/new-betlink/.claude-instructions/feature-1.4/access-test-results-1.4.md`

### Task 3: Visual and Content Validation (Minutes 60-75)

**Once all pages are ready:**

1. **Check Portuguese translations**:
   Look for any English text and list them:
   ```markdown
   # English Text Found
   - Page: /tipster/dashboard
   - Text: "Dashboard" in header
   - Should be: "Painel do Tipster"
   ```

2. **Verify navigation flow**:
   - [ ] All 4 pages accessible via sidebar
   - [ ] Active state updates correctly
   - [ ] Breadcrumbs show correct path
   - [ ] Mobile drawer works

3. **Check mock data quality**:
   - [ ] Stats make sense (ROI, win rate, etc.)
   - [ ] Subscriber data looks realistic
   - [ ] Channel example is complete

### Task 4: Responsive Testing (Minutes 75-85)

Test each page on different viewports:

1. **Desktop (1920px)**:
   - [ ] Sidebar visible and fixed
   - [ ] Content properly spaced
   - [ ] Tables/cards aligned

2. **Tablet (768px)**:
   - [ ] Sidebar visible or drawer?
   - [ ] Content adapts well
   - [ ] No horizontal scroll

3. **Mobile (375px)**:
   - [ ] Drawer menu accessible
   - [ ] Cards stack vertically
   - [ ] Tables are scrollable

### Task 5: Final Report (Last 5 minutes)

Create comprehensive test report at:
`/mnt/c/Users/pedro/Projetos/new-betlink/.claude-instructions/feature-1.4/feature-1.4-test-report.md`

```markdown
# Feature 1.4 Test Report

## Summary
- Total tests run: ___
- Passed: ___
- Failed: ___
- Blocked: ___

## Access Control Matrix
[Include your test results table]

## Visual Validation
- Portuguese: ✅/⚠️ [list issues]
- Navigation: ✅/⚠️ [list issues]
- Mock data: ✅/⚠️ [list issues]

## Responsive Design
- Desktop: ✅/⚠️
- Tablet: ✅/⚠️
- Mobile: ✅/⚠️

## Bugs Found
1. [Description, steps to reproduce]

## Performance
- Page load: Fast/Normal/Slow
- Navigation: Smooth/Laggy

## Overall Status
Feature 1.4 is: ✅ Ready / ⚠️ Has issues / ❌ Blocked

## Recommendations
[Any suggestions for improvement]
```

## Important Notes

### DO NOT MODIFY
- `/lib/supabase/middleware.ts` - Protection already exists!
- `/lib/auth/*` - Auth logic is working
- Any file outside `/app/tipster/*` unless fixing a bug

### FOCUS ON
- Testing cliente being blocked
- Verifying hierarchical access (admin/master)
- Portuguese translations
- Consistency with client area design

### Expected Patterns
The tipster area should feel similar to the client area but with:
- Different navigation items
- Tipster-specific stats
- Channel management context
- Subscriber lists instead of subscriptions

## Success Criteria

By the end, you should have verified:
- ✅ Cliente blocked from tipster area
- ✅ Tipster can access all 4 pages
- ✅ Admin/Master have hierarchical access
- ✅ Non-authenticated users redirected
- ✅ UI is consistent with client area
- ✅ All text in Portuguese
- ✅ Mobile responsive
- ✅ No console errors

## If You Find Issues

1. **Access control not working**:
   - Check if middleware is being bypassed
   - Verify layout.tsx has correct roles array
   - Clear cookies and test again

2. **Visual inconsistencies**:
   - Compare with client area pages
   - Note specific differences
   - Suggest fixes

3. **Performance issues**:
   - Note which pages are slow
   - Check for console errors
   - Monitor network tab

---

**Remember**: The middleware already blocks clients! If it's not working, there's a bug to investigate.