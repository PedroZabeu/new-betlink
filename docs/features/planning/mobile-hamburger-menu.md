# Mobile Hamburger Menu Implementation Plan

## Overview
Currently, the mobile navigation shows items horizontally, which can be cramped on small screens. We need to implement a proper hamburger menu.

## Current State
- Desktop: Horizontal navigation works well
- Mobile: Items shown horizontally (temporary solution from Feature 1.1)
- Drawer component already available from shadcn/ui

## Implementation Steps

### 1. Update Header Component (`/components/header.tsx`)
```typescript
// Add state for mobile menu
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// Add hamburger button (visible only on mobile)
<Button
  variant="ghost"
  size="icon"
  className="md:hidden"
  onClick={() => setMobileMenuOpen(true)}
>
  <Menu className="h-5 w-5" />
</Button>

// Hide horizontal nav items on mobile
<nav className="hidden md:flex items-center gap-6">
```

### 2. Create Mobile Menu Drawer
```typescript
<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
  <SheetContent side="left" className="w-[300px]">
    <SheetHeader>
      <SheetTitle>Menu</SheetTitle>
    </SheetHeader>
    <nav className="flex flex-col gap-4 mt-8">
      <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>
        Blog
      </Link>
      <Link href="/sobre" onClick={() => setMobileMenuOpen(false)}>
        Sobre
      </Link>
      <Link href="/canais" onClick={() => setMobileMenuOpen(false)}>
        Explorar Tipsters
      </Link>
    </nav>
  </SheetContent>
</Sheet>
```

### 3. Components Needed
- Sheet component from shadcn/ui (already installed)
- Menu icon from lucide-react
- Responsive utilities from Tailwind

### 4. Testing Checklist
- [ ] Hamburger visible only on mobile
- [ ] Drawer opens/closes smoothly
- [ ] Links work and close drawer
- [ ] Desktop navigation unchanged
- [ ] No layout shift

## Time Estimate: 30-45 minutes