# Test Guide: Feature 1.6 - Compliance Pages

## Overview
Test guide for the Terms of Service and Privacy Policy pages created for Feature 1.6.

## Pages Created
- **Terms of Service**: `/termos`
- **Privacy Policy**: `/privacidade`

## Test Scenarios

### 1. Page Accessibility
- [ ] Navigate to `/termos` - should display Terms of Service page
- [ ] Navigate to `/privacidade` - should display Privacy Policy page
- [ ] Both pages should load without errors

### 2. Header Integration
- [ ] Header component should be visible on both pages
- [ ] Logo should link to home page
- [ ] Navigation links should work
- [ ] Auth button should be functional

### 3. Layout and Design
- [ ] Pages should have professional, readable layout
- [ ] Typography should be consistent with design guidelines
- [ ] Content should be properly spaced and formatted
- [ ] Pages should be responsive on mobile/tablet

### 4. Table of Contents
- [ ] Table of contents should be visible on both pages
- [ ] All links in table of contents should work
- [ ] Clicking links should scroll to correct sections
- [ ] Smooth scrolling should work

### 5. Content Sections
- [ ] All required sections should be present
- [ ] Section headers should be properly formatted
- [ ] Content should be readable with good line height
- [ ] Lists should be properly formatted

### 6. Responsive Design
- [ ] Pages should work on desktop (1200px+)
- [ ] Pages should work on tablet (768px-1199px)
- [ ] Pages should work on mobile (<768px)
- [ ] Text should remain readable on all screen sizes

### 7. Navigation
- [ ] Browser back/forward buttons should work
- [ ] Direct URL access should work
- [ ] Page should be bookmarkable

## Required Sections Verification

### Terms of Service (`/termos`)
- [ ] Acceptance of Terms
- [ ] Description of Service
- [ ] User Accounts
- [ ] Prohibited Uses
- [ ] Intellectual Property
- [ ] Disclaimers
- [ ] Limitation of Liability
- [ ] Governing Law
- [ ] Changes to Terms
- [ ] Contact Information

### Privacy Policy (`/privacidade`)
- [ ] Information We Collect
- [ ] How We Use Your Information
- [ ] Information Sharing
- [ ] Data Security
- [ ] Your Rights (LGPD compliance)
- [ ] Cookies and Tracking
- [ ] Children's Privacy
- [ ] Changes to Privacy Policy
- [ ] Contact Our DPO

## Technical Requirements
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] No ESLint errors (for these pages)
- [ ] Proper semantic HTML structure
- [ ] Accessible navigation

## Content Notes
- Content is placeholder text for now
- Company info: BetLink Tecnologia Ltda
- CNPJ: XX.XXX.XXX/0001-XX
- Address: São Paulo, SP, Brasil
- Contact emails: legal@betlink.com, privacidade@betlink.com, dpo@betlink.com

## Success Criteria
- [ ] Both pages accessible at correct URLs
- [ ] Header component integrated and functional
- [ ] Professional, readable layout
- [ ] All required sections included
- [ ] Responsive design working
- [ ] No console errors
- [ ] Smooth scroll navigation working
- [ ] Table of contents functional

## Next Steps
After testing, the pages are ready for:
1. Legal review of content
2. Integration with footer links
3. SEO optimization
4. Analytics tracking setup 