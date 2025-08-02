# Task: Create Terms and Privacy Pages

## Priority: HIGH - Legal Compliance Required

Please create the following two pages:

### 1. Terms of Service Page (`/app/termos/page.tsx`)

Create a page with these sections:
- Header matching the style of /app/sobre/page.tsx
- Terms sections:
  - 1. Aceitação dos Termos
  - 2. Descrição do Serviço
  - 3. Cadastro e Conta
  - 4. Assinaturas e Pagamentos
  - 5. Uso Adequado
  - 6. Propriedade Intelectual
  - 7. Limitação de Responsabilidade
  - 8. Modificações dos Termos
  - 9. Lei Aplicável
- Footer with "Última atualização: 26 de Janeiro de 2025"
- Use PageWrapper component for consistent design

### 2. Privacy Policy Page (`/app/privacidade/page.tsx`)

Create a page with these sections:
- Header matching the style of /app/sobre/page.tsx
- Privacy sections:
  - 1. Informações que Coletamos
  - 2. Como Usamos suas Informações
  - 3. Compartilhamento de Dados
  - 4. Segurança dos Dados
  - 5. Seus Direitos (LGPD)
  - 6. Cookies e Tecnologias
  - 7. Retenção de Dados
  - 8. Contato
- Footer with "Última atualização: 26 de Janeiro de 2025"
- Use PageWrapper component for consistent design

### Implementation Notes:
- Copy the structure from `/app/sobre/page.tsx`
- Use the PageWrapper component from `/components/ui/page-wrapper.tsx`
- Keep the same visual style (max-w-4xl, prose classes)
- Make sure both pages are accessible from the footer links
- Use placeholder legal text in Portuguese

### Files to Create:
1. `/app/termos/page.tsx`
2. `/app/privacidade/page.tsx`

No need to modify any other files - the links are already in place.