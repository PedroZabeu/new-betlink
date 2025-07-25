# Feature 1.6 - Test Guide: Polish + Final Testing

## Overview
Feature 1.6 completes EPIC 1 by adding institutional pages, cookie consent, and performing final polish. This guide covers all testing scenarios.

## Test Environment Setup
1. Ensure dev server is running: `npm run dev`
2. Clear localStorage to test cookie banner on first visit
3. Have all 4 test users ready:
   - Cliente: `newcliente@betlink.com` (password123)
   - Tipster: `newtipster@betlink.com` (password123)
   - Admin: `newadmin@betlink.com` (password123)
   - Master: `newmaster@betlink.com` (password123)

## Test Scenarios

### 1. New Pages Accessibility
**Test all new pages are accessible and rendered correctly**

- [ ] Navigate to `/sobre` - About page loads with Header
- [ ] Navigate to `/blog` - Blog page shows post grid
- [ ] Navigate to `/termos` - Terms page with legal content
- [ ] Navigate to `/privacidade` - Privacy policy page
- [ ] All pages responsive on mobile/tablet/desktop
- [ ] Header navigation works on all pages

### 2. Cookie Consent Banner
**Test cookie consent functionality**

- [ ] First visit: Banner appears at bottom of page
- [ ] Banner doesn't block content interaction
- [ ] "Accept All" button saves preference and hides banner
- [ ] "Customize" opens preferences modal
- [ ] Preferences are saved in localStorage
- [ ] Banner doesn't reappear after accepting
- [ ] Clear localStorage → banner appears again

### 3. Blog Page Features
**Test blog listing functionality**

- [ ] At least 6 blog posts displayed
- [ ] Each post has: image, title, excerpt, author, date
- [ ] Posts arranged in responsive grid (3 cols desktop, 1 mobile)
- [ ] Category badges visible
- [ ] Hover effects on post cards
- [ ] Click on post shows "coming soon" or similar

### 4. About Page Sections
**Test about page content and layout**

- [ ] Hero section with compelling headline
- [ ] Company statistics displayed prominently
- [ ] Mission/Vision/Values sections
- [ ] Team section (even if mock data)
- [ ] Smooth scroll if using anchor navigation
- [ ] All sections responsive

### 5. Legal Pages Usability
**Test terms and privacy pages**

- [ ] Table of contents with working anchor links
- [ ] Smooth scroll to sections
- [ ] Text is readable (proper line height, font size)
- [ ] "Last updated" date visible
- [ ] Contact information included
- [ ] Mobile: TOC collapsed or accessible

### 6. Complete User Flow Tests

#### Cliente Flow
1. [ ] Land on home → Click "Explorar Canais"
2. [ ] View channel list (redirects to login)
3. [ ] Sign up new account
4. [ ] Redirected to `/cliente/dashboard`
5. [ ] Navigate through client pages
6. [ ] Visit About and Blog pages
7. [ ] Logout successfully

#### Tipster Flow
1. [ ] Login as tipster
2. [ ] Navigate to dashboard
3. [ ] Access all tipster pages
4. [ ] Visit institutional pages
5. [ ] Check header shows correct avatar
6. [ ] Logout and redirect to home

#### Admin Flow
1. [ ] Login as admin
2. [ ] Access admin dashboard
3. [ ] Navigate all admin pages (except /admin/admins)
4. [ ] Verify can't access master-only page
5. [ ] Visit public pages
6. [ ] Test logout

#### Master Flow
1. [ ] Login as master
2. [ ] Access ALL admin pages including /admin/admins
3. [ ] See all conditional navigation items
4. [ ] Access all areas of the platform
5. [ ] Verify complete access

### 7. Visual Polish Checklist
**Ensure consistent design across platform**

- [ ] Consistent spacing (padding/margins)
- [ ] Color scheme applied uniformly
- [ ] All buttons have hover states
- [ ] Focus states for accessibility
- [ ] Loading states where applicable
- [ ] Error states styled consistently
- [ ] Transitions are smooth (0.2s)

### 8. Header/Footer Consistency
**Verify navigation elements**

- [ ] Header appears on ALL pages
- [ ] Auth button shows correct state
- [ ] Navigation links all work
- [ ] Footer links to new legal pages
- [ ] Mobile menu includes all items

### 9. Performance & Console Check
**Technical verification**

- [ ] No errors in browser console
- [ ] No warnings (except React strict mode)
- [ ] Page load time < 3 seconds
- [ ] Images have proper alt texts
- [ ] No broken links (check all hrefs)
- [ ] Cookie banner doesn't affect performance

### 10. Cross-Browser Testing
**Test on multiple browsers**

- [ ] Chrome: All features working
- [ ] Firefox: All features working
- [ ] Safari: All features working
- [ ] Edge: All features working
- [ ] Mobile browsers: Responsive design works

## Final Acceptance Criteria

### Must Pass (Blocking)
- ✅ All pages accessible without errors
- ✅ Cookie consent functional
- ✅ Complete flows work for all user types
- ✅ No console errors
- ✅ Responsive design on all devices

### Should Pass (Important)
- ✅ Visual consistency across platform
- ✅ All navigation links working
- ✅ Performance acceptable
- ✅ Legal pages properly formatted

### Nice to Have
- ✅ Smooth animations
- ✅ Perfect pixel alignment
- ✅ Advanced cookie preferences

## Bug Report Template
If issues found:
```
**Issue**: [Brief description]
**Page**: [URL where issue occurs]
**Steps**: [How to reproduce]
**Expected**: [What should happen]
**Actual**: [What actually happens]
**Screenshot**: [If applicable]
```

## Sign-off Checklist
Before marking Feature 1.6 complete:

- [ ] All test scenarios passed
- [ ] No blocking bugs remain
- [ ] Documentation updated
- [ ] Ready for production
- [ ] EPIC 1 can be closed

---

**Test Duration**: Estimated 2-3 hours for complete testing
**Tester**: _____________
**Date**: _____________
**Result**: PASS / FAIL (circle one)