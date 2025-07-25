# Feature 1.3: Visual Mockups & Component Specs

## Dashboard Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  BetLink  [Explorar] [Sobre] [Blog]          [User ▼] [Theme]  │ <- Header (exists)
├───────────────────┬─────────────────────────────────────────────┤
│                   │  Home > Cliente > Dashboard                 │ <- Breadcrumb
│  📊 Dashboard     │ ─────────────────────────────────────────── │
│  💳 Assinaturas   │                                             │
│  📜 Histórico     │  Dashboard                                  │ <- Page Title
│                   │                                             │
│  ─────────────    │  ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│                   │  │ Stats   │ │ Stats   │ │ Stats   │      │ <- Stats Cards
│  [User Avatar]    │  │ Card 1  │ │ Card 2  │ │ Card 3  │      │
│  Cliente          │  └─────────┘ └─────────┘ └─────────┘      │
│                   │                                             │
│                   │  Últimas Tips                              │
│                   │  ┌─────────────────────────────────┐      │
│                   │  │      📭 Nenhuma tip ainda       │      │ <- Empty State
│                   │  │   Você verá suas tips aqui      │      │
│                   │  └─────────────────────────────────┘      │
└───────────────────┴─────────────────────────────────────────────┘
         200px                        Flex: 1
```

## Component Specifications

### 1. SidebarNav Component
```tsx
// Visual Specs:
- Width: 200px (desktop), full drawer (mobile)
- Background: background/95 with border-r
- Padding: p-4
- Gap between items: gap-1

// Nav Item Specs:
- Height: 40px
- Padding: px-3 py-2
- Border radius: rounded-md
- Hover: hover:bg-accent
- Active: bg-accent text-accent-foreground
- Icon size: 16px (h-4 w-4)
- Icon margin: mr-2
```

### 2. StatsCard Component
```tsx
// Visual Example:
┌─────────────────────────┐
│ 💳 Assinaturas Ativas   │
│                         │
│ 2           ↑ 12%       │
│ ────────────────        │
│ +1 este mês            │
└─────────────────────────┘

// Specs:
- Border: border rounded-lg
- Padding: p-6
- Icon: 32px colored background
- Value: text-2xl font-bold
- Trend: text-sm with arrow
```

### 3. EmptyState Component
```tsx
// Visual Example:
┌─────────────────────────────────┐
│                                 │
│            📭                   │
│                                 │
│    Você ainda não tem           │
│      assinaturas               │
│                                 │
│   Explore nossos tipsters       │
│   e comece a lucrar            │
│                                 │
│    [Explorar Tipsters]          │
│                                 │
└─────────────────────────────────┘

// Specs:
- Max width: max-w-md mx-auto
- Padding: py-12
- Icon: 48px muted color
- Text align: center
- Button: primary variant
```

### 4. PageHeader Component
```tsx
// Structure:
<PageHeader
  title="Dashboard"
  description="Acompanhe suas assinaturas e resultados"
  breadcrumb={[
    { label: "Home", href: "/" },
    { label: "Cliente", href: "/cliente" },
    { label: "Dashboard" }
  ]}
  actions={
    <Button>Nova Assinatura</Button>
  }
/>

// Visual:
Home > Cliente > Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dashboard                    [Nova Assinatura]
Acompanhe suas assinaturas e resultados
```

## Mobile Responsive Behavior

### Breakpoints
- Desktop: >= 768px (md)
- Mobile: < 768px

### Mobile Adaptations
1. **Sidebar**: Becomes a drawer with hamburger menu
2. **Stats Cards**: Stack vertically (grid-cols-1)
3. **Page Container**: Reduced padding (p-4 instead of p-6)
4. **Empty States**: Smaller icons and text

## Color Palette Usage

### Based on Current Theme
```css
/* From existing theme */
--background: Main page background
--foreground: Main text color
--card: Card backgrounds
--card-foreground: Card text
--accent: Active states, hovers
--muted: Secondary text, empty states
--border: All borders
```

### Component Color Mapping
- **Sidebar**: background with border
- **Active Nav**: accent background
- **Stats Cards**: card background
- **Empty State Icon**: muted foreground
- **Success Indicators**: green-500 (profits)
- **Warning Indicators**: yellow-500 (pending)

## Icons from Lucide React

### Navigation Icons
```tsx
import {
  LayoutDashboard,  // Dashboard
  CreditCard,       // Assinaturas
  FileText,         // Histórico
  User,             // Profile
  Settings,         // Settings
  TrendingUp,       // Positive trend
  TrendingDown,     // Negative trend
  Users,            // Active subscriptions
  DollarSign,       // Money/payments
} from "lucide-react"
```

## Interaction States

### Button States
- Default: Normal appearance
- Hover: Slight opacity change
- Active: Scale down slightly
- Disabled: Opacity 50%, cursor not-allowed

### Navigation States
- Default: Transparent background
- Hover: accent background with transition
- Active: accent background, font-medium
- Disabled: Opacity 50%

### Card States
- Default: Normal border
- Hover: Slight shadow (if clickable)
- Loading: Skeleton animation

## Accessibility Considerations

1. **ARIA Labels**: All icon buttons have proper labels
2. **Keyboard Navigation**: Tab order follows visual order
3. **Focus States**: Visible focus rings on all interactive elements
4. **Screen Readers**: Empty states have descriptive text
5. **Color Contrast**: Following WCAG AA standards

## Animation Guidelines

### Transitions
```css
/* Default transition for all interactions */
transition: all 150ms ease-in-out;
```

### Page Transitions
- Fade in on mount (opacity 0 to 1)
- No sliding animations (too heavy)

### Loading States
- Skeleton screens for content
- Spinner for actions

## Data Display Formats

### Numbers
- Currency: R$ 1.234,56
- Percentage: +145% (with + or -)
- Count: 1.234 (with thousand separator)

### Dates
- Short: 25/01/2025
- Long: 25 de Janeiro de 2025
- Relative: Há 2 dias

### Status
- Active: Green dot + "Ativa"
- Cancelled: Red dot + "Cancelada"
- Pending: Yellow dot + "Pendente"

---

These mockups provide the visual foundation for implementing Feature 1.3 while maintaining consistency with the existing design system.