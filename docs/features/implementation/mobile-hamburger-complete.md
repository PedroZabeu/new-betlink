# Mobile Hamburger Menu - Complete Implementation

## Full Header Component with Mobile Menu

```typescript
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { BetlinkLogo } from "./betlink-logo";
import { AuthButton } from "./auth-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationLinks = [
    { href: "/canais", label: "Explorar Canais" },
    { href: "/sobre", label: "Sobre" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <BetlinkLogo />
            </Link>
            
            {/* Desktop Navigation - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-6">
              {navigationLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button - Only visible on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] sm:w-[320px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <BetlinkLogo className="h-6 w-6" />
              <span>Menu</span>
            </SheetTitle>
          </SheetHeader>
          
          <nav className="flex flex-col gap-4 mt-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center py-2 text-lg font-medium hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Divider */}
            <div className="h-px bg-border my-2" />
            
            {/* Additional mobile-only links could go here */}
            <Link
              href="/termos"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Termos de Uso
            </Link>
            <Link
              href="/privacidade"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Política de Privacidade
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
```

## Key Implementation Details

### 1. State Management
- Uses `useState` to control the mobile menu open/closed state
- Single source of truth for menu visibility

### 2. Navigation Links Array
- Centralized navigation links for consistency
- Easy to add/remove/reorder links
- Reused in both desktop and mobile views

### 3. Responsive Design
- Hamburger button: `className="md:hidden"` - only visible on mobile
- Desktop nav: `className="hidden md:flex"` - hidden on mobile
- No JavaScript needed for responsive behavior

### 4. Mobile Sheet Behavior
- Opens from left side for natural mobile UX
- Width adjusts based on screen size (280px on small, 320px on larger)
- Clicking any link automatically closes the menu
- Sheet backdrop closes menu when clicked

### 5. Accessibility
- Proper `aria-label` on hamburger button
- Sheet component handles focus management
- Keyboard navigation supported

### 6. Visual Enhancements
- Logo repeated in mobile menu header
- Divider separating main nav from footer links
- Added terms/privacy links (mobile-only bonus)
- Consistent hover states

## Testing Checklist

### Desktop (>= 768px)
- [ ] Hamburger button NOT visible
- [ ] Horizontal navigation visible
- [ ] All links work correctly
- [ ] No layout shift

### Mobile (< 768px)
- [ ] Hamburger button visible
- [ ] Horizontal navigation hidden
- [ ] Sheet opens smoothly from left
- [ ] All links navigate correctly
- [ ] Sheet closes after link click
- [ ] Sheet closes on backdrop click
- [ ] No horizontal scroll

### Accessibility
- [ ] Tab navigation works
- [ ] Screen reader announces button
- [ ] Escape key closes sheet
- [ ] Focus trapped in sheet when open

## Alternative Enhancements

### 1. Add Icons to Mobile Menu
```typescript
import { Compass, Info, BookOpen } from "lucide-react";

const navigationLinks = [
  { href: "/canais", label: "Explorar Canais", icon: Compass },
  { href: "/sobre", label: "Sobre", icon: Info },
  { href: "/blog", label: "Blog", icon: BookOpen },
];

// In mobile menu:
<Link...>
  <link.icon className="h-5 w-5 mr-3" />
  {link.label}
</Link>
```

### 2. Add User Info in Mobile Menu
```typescript
// If user is logged in, show their info at top of mobile menu
{user && (
  <div className="flex items-center gap-3 pb-4 mb-4 border-b">
    <Avatar className="h-10 w-10">
      <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
    </Avatar>
    <div>
      <p className="text-sm font-medium">{user.email}</p>
      <p className="text-xs text-muted-foreground">
        {user.role === 'master' ? 'Master' : 
         user.role === 'admin' ? 'Admin' : 
         user.role === 'tipster' ? 'Tipster' : 'Cliente'}
      </p>
    </div>
  </div>
)}
```

### 3. Animated Hamburger Icon
```typescript
// Transform hamburger to X when open
<Button...>
  {mobileMenuOpen ? (
    <X className="h-5 w-5" />
  ) : (
    <Menu className="h-5 w-5" />
  )}
</Button>
```

## Implementation Time: 30-45 minutes

### Breakdown:
- 5 min: Convert Header to client component
- 10 min: Add state and hamburger button
- 10 min: Implement Sheet with navigation
- 5 min: Test all responsive breakpoints
- 5 min: Test navigation and closing behavior
- 10 min: (Optional) Add enhancements