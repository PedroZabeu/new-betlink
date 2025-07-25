# Feature 1.3: Test Scenarios & Validation Plan

## Pre-Implementation Checklist
- [ ] Feature 1.2 working (auth + roles)
- [ ] All 4 test users can login
- [ ] Middleware blocking unauthorized access
- [ ] `/access-denied` page exists

## Test Scenarios

### Scenario 1: Cliente User Journey
**User**: newcliente@betlink.com

```
1. Login at /auth/login
   Expected: Redirect to /cliente/dashboard
   
2. View Dashboard
   Expected: See 3 stats cards, empty states
   
3. Click "Assinaturas" in sidebar
   Expected: Navigate to /cliente/assinaturas
   
4. Click "Histórico" in sidebar
   Expected: Navigate to /cliente/historico
   
5. Try accessing /tipster/dashboard
   Expected: Redirect to /access-denied
   
6. Try accessing /admin/dashboard
   Expected: Redirect to /access-denied
   
7. Click logout
   Expected: Redirect to /auth/login
```

### Scenario 2: Tipster User Journey
**User**: newtipster@betlink.com

```
1. Login and get redirected to /tipster/dashboard
   Expected: 404 (tipster pages not implemented yet)
   
2. Manually navigate to /cliente/dashboard
   Expected: ✅ Access granted (tipsters can view client area)
   
3. Navigate through all client pages
   Expected: ✅ Full access to cliente/*
   
4. Try accessing /admin/dashboard
   Expected: ❌ Redirect to /access-denied
```

### Scenario 3: Admin User Journey
**User**: newadmin@betlink.com

```
1. Login → /admin/dashboard (404)
2. Access /cliente/* → ✅ Allowed
3. Access /tipster/* → ✅ Allowed  
4. Access /master/* → ❌ Blocked
```

### Scenario 4: Master User Journey
**User**: newmaster@betlink.com

```
1. Can access ALL routes
2. No restrictions
3. Test all /cliente/* pages
```

### Scenario 5: Unauthenticated User
**User**: Not logged in

```
1. Try accessing /cliente/dashboard
   Expected: Redirect to /auth/login
   
2. Try accessing /cliente/assinaturas
   Expected: Redirect to /auth/login
   
3. Try accessing /cliente/historico
   Expected: Redirect to /auth/login
```

## Component-Level Tests

### SidebarNav Tests
```
1. Active state matches current route
2. All links navigate correctly
3. Icons render properly
4. Mobile drawer toggles
5. User info shows at bottom
```

### StatsCard Tests
```
1. Displays title, value, icon
2. Trend indicator shows when provided
3. Responsive on mobile
4. Handles long text gracefully
```

### EmptyState Tests
```
1. Icon renders
2. Title and description show
3. Action button works (if provided)
4. Centered properly
```

### PageHeader Tests
```
1. Breadcrumb generates from route
2. Title displays
3. Description optional
4. Actions slot works
```

## Visual Regression Tests

### Desktop (1920x1080)
- [ ] Dashboard screenshot
- [ ] Assinaturas screenshot
- [ ] Histórico screenshot
- [ ] Sidebar expanded

### Tablet (768x1024)
- [ ] Same pages
- [ ] Check responsive grid

### Mobile (375x667)
- [ ] Drawer closed
- [ ] Drawer open
- [ ] All pages

## Performance Tests

### Load Times
- [ ] Dashboard < 1s
- [ ] Navigation < 200ms
- [ ] No layout shift

### Bundle Size
- [ ] Check if lucide-react adds significant weight
- [ ] Lazy load icons if needed

## Accessibility Tests

### Keyboard Navigation
```
1. Tab through entire dashboard
2. Enter activates links
3. Escape closes mobile drawer
4. Focus visible on all elements
```

### Screen Reader
```
1. All images have alt text
2. Buttons have aria-labels
3. Navigation landmarks present
4. Page titles announced
```

## Security Tests

### Route Protection
```typescript
// Test matrix:
const testMatrix = [
  { user: 'cliente', route: '/cliente/*', expected: 'allow' },
  { user: 'cliente', route: '/tipster/*', expected: 'deny' },
  { user: 'cliente', route: '/admin/*', expected: 'deny' },
  { user: 'tipster', route: '/cliente/*', expected: 'allow' },
  { user: 'admin', route: '/cliente/*', expected: 'allow' },
  { user: 'master', route: '/cliente/*', expected: 'allow' },
  { user: null, route: '/cliente/*', expected: 'login' }
]
```

### Data Exposure
- [ ] No real user data in placeholders
- [ ] No API keys in client code
- [ ] No sensitive routes exposed

## Error Handling Tests

### Network Errors
```
1. Lose connection after login
   Expected: Stay on page, show cached content
   
2. Lose connection during navigation
   Expected: Error boundary catches
```

### Invalid Routes
```
1. /cliente/invalid-page
   Expected: 404 page
   
2. /cliente/dashboard/extra
   Expected: 404 page
```

## Browser Compatibility

### Browsers to Test
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Features to Verify
- CSS Grid support
- Flexbox layout
- Theme switching
- Local storage

## Mobile-Specific Tests

### Touch Interactions
- [ ] Drawer swipe works
- [ ] Taps register correctly
- [ ] No double-tap zoom

### Viewport
- [ ] No horizontal scroll
- [ ] Content fits screen
- [ ] Readable font sizes

## Integration Tests

### With Existing Features
```
1. Theme switcher still works
2. Logout from any page works
3. Header user menu functional
4. Navigation doesn't break auth
```

### State Persistence
```
1. Refresh maintains auth
2. Theme preference saved
3. Active nav state persists
```

## Test Data Validation

### Mock Data Consistency
```typescript
// Ensure all mock data follows format:
const mockStats = {
  subscriptions: 2,        // Always number
  monthlySpend: 89.90,    // Always 2 decimals
  avgROI: 145,            // Always percentage
}
```

## Automated Test Checklist

While we're not implementing automated tests yet, these would be the test cases:

```typescript
describe('Cliente Dashboard', () => {
  it('redirects unauthenticated users')
  it('allows cliente role access')
  it('blocks unauthorized roles')
  it('renders all stats cards')
  it('shows empty states')
  it('navigates between pages')
  it('maintains auth on refresh')
})
```

## Post-Implementation Validation

### Manual QA Checklist
- [ ] All 4 test users tested
- [ ] All pages load without errors
- [ ] Console has no warnings
- [ ] Network tab shows no 404s (except dashboards)
- [ ] Mobile responsive verified
- [ ] Theme switching works
- [ ] Build succeeds
- [ ] TypeScript has no errors

### Sign-off Criteria
- [ ] Product Owner can navigate all pages
- [ ] No visual regression from Feature 1.2
- [ ] Access control working perfectly
- [ ] Ready for Feature 1.4

---

**Note**: Save screenshots of each test for documentation and future reference.