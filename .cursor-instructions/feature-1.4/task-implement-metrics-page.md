# Task: Implement Tipster Metrics Page

**Priority**: HIGH
**Time**: 15 minutes

## Context
Claude is implementing the tipster pages. You can help by implementing the Metrics page while Claude works on the other pages.

## Your Task: Create the Metrics Page

Create file: `/mnt/c/Users/pedro/Projetos/new-betlink/app/tipster/metricas/page.tsx`

### Requirements:

1. **Import necessary components**:
   - PageHeader from "@/components/layouts/page-header"
   - EmptyState from "@/components/ui/empty-state"
   - Card components from "@/components/ui/card"
   - Select components from "@/components/ui/select"
   - Icons: BarChart3, TrendingUp, Target from "lucide-react"

2. **Page structure**:
   ```typescript
   "use client";
   
   import { useState } from "react";
   // ... other imports
   
   export default function MetricasPage() {
     const [period, setPeriod] = useState("30");
     
     return (
       <>
         {/* PageHeader with title "Métricas de Performance" */}
         {/* Period filter using Select (30, 60, 90 dias) */}
         {/* Grid of metric cards */}
         {/* Empty state for charts */}
       </>
     );
   }
   ```

3. **Mock metrics data**:
   ```typescript
   const metrics = [
     { title: "ROI Médio", value: "+145%", icon: TrendingUp },
     { title: "Win Rate", value: "68%", icon: Target },
     { title: "Yield", value: "5.2%", icon: BarChart3 },
     { title: "Odd Média", value: "1.85", icon: Target }
   ];
   ```

4. **Key features**:
   - PageHeader with breadcrumb: [{ title: "Métricas" }]
   - Period selector (Últimos 30/60/90 dias)
   - Grid of metric cards (use regular Card, not StatsCard)
   - EmptyState for "Gráficos detalhados em breve"

5. **Make sure**:
   - All text is in Portuguese
   - Page is responsive
   - Follows the same style as other pages

## Example structure:
```
PageHeader
Period Filter (Select)
Grid of 4 Metric Cards
Large Card with EmptyState (future charts)
```

## When done:
Report completion in `.claude-instructions/feature-1.4/metrics-page-complete.md` with any issues found.