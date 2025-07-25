# Task: Create Terms and Privacy Pages for Feature 1.6

## Overview
Create two compliance pages (Terms of Service and Privacy Policy) with professional layout and placeholder content.

## Files to Create

### 1. Terms of Service Page
**Path**: `/mnt/c/Users/pedro/Projetos/new-betlink/app/termos/page.tsx`

**Requirements**:
- Use the main Header component (import from `@/components/header`)
- Clean, readable layout for legal text
- Include sections:
  - Acceptance of Terms
  - Description of Service
  - User Accounts
  - Prohibited Uses
  - Intellectual Property
  - Disclaimers
  - Limitation of Liability
  - Governing Law
  - Changes to Terms
  - Contact Information
- Add "Last updated: January 25, 2025" at the top
- Use proper typography with good line height for readability
- Add a table of contents with anchor links
- Make it scrollable with smooth scroll behavior

### 2. Privacy Policy Page
**Path**: `/mnt/c/Users/pedro/Projetos/new-betlink/app/privacidade/page.tsx`

**Requirements**:
- Use the main Header component (import from `@/components/header`)
- Similar layout to Terms page
- Include sections:
  - Information We Collect
  - How We Use Your Information
  - Information Sharing
  - Data Security
  - Your Rights (LGPD compliance)
  - Cookies and Tracking
  - Children's Privacy
  - Changes to Privacy Policy
  - Contact Our DPO
- Add "Last updated: January 25, 2025" at the top
- Include email: privacidade@betlink.com
- Use consistent styling with Terms page

## Design Guidelines

### Layout Structure
```tsx
<div className="min-h-screen flex flex-col">
  <Header />
  <main className="flex-1">
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Content */}
    </div>
  </main>
</div>
```

### Typography Classes
- Title: `text-3xl font-bold mb-8`
- Last Updated: `text-sm text-muted-foreground mb-8`
- Section Headers: `text-xl font-semibold mb-4 mt-8`
- Paragraphs: `text-muted-foreground mb-4 leading-relaxed`
- Lists: `list-disc list-inside mb-4 text-muted-foreground`

### Table of Contents
Create a sticky sidebar on desktop or a collapsible section on mobile with links to each section using hash navigation.

## Example Structure

```tsx
export default function TermosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">Termos de Uso</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Última atualização: 25 de Janeiro de 2025
          </p>
          
          {/* Table of Contents */}
          <nav className="mb-8 p-4 bg-muted/50 rounded-lg">
            <h2 className="font-semibold mb-2">Índice</h2>
            <ul className="space-y-1">
              <li><a href="#acceptance" className="text-primary hover:underline">1. Aceitação dos Termos</a></li>
              {/* More items */}
            </ul>
          </nav>

          {/* Content sections */}
          <section id="acceptance" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Ao acessar e usar a plataforma BetLink...
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
```

## Content Notes

### Terms of Service
- Use Portuguese (pt-BR) language
- Keep tone formal but accessible
- Include placeholder company info: "BetLink Tecnologia Ltda"
- CNPJ: XX.XXX.XXX/0001-XX
- Address: São Paulo, SP, Brasil

### Privacy Policy
- Reference LGPD (Brazilian data protection law)
- Include DPO contact: dpo@betlink.com
- Mention data retention periods
- Explain user rights clearly

## Testing Requirements

After creating both pages:
1. Verify Header is displaying correctly
2. Test all anchor links in table of contents
3. Check responsive design on mobile/tablet
4. Ensure smooth scrolling works
5. Verify text is readable with proper spacing
6. Test that both pages are accessible at `/termos` and `/privacidade`

## Success Criteria
- [ ] Both pages created and accessible
- [ ] Header component integrated
- [ ] Professional, readable layout
- [ ] All required sections included
- [ ] Responsive design working
- [ ] No console errors
- [ ] Smooth scroll navigation working

**Note**: Focus on structure and layout. The actual legal content is placeholder text for now.