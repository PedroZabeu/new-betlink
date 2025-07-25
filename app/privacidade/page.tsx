import { Header } from "@/components/header";

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Última atualização: 25 de Janeiro de 2025
          </p>
          
          {/* Table of Contents */}
          <nav className="mb-8 p-4 bg-muted/50 rounded-lg">
            <h2 className="font-semibold mb-2">Índice</h2>
            <ul className="space-y-1">
              <li><a href="#collect" className="text-primary hover:underline">1. Informações que Coletamos</a></li>
              <li><a href="#use" className="text-primary hover:underline">2. Como Usamos Suas Informações</a></li>
              <li><a href="#sharing" className="text-primary hover:underline">3. Compartilhamento de Informações</a></li>
              <li><a href="#security" className="text-primary hover:underline">4. Segurança dos Dados</a></li>
              <li><a href="#rights" className="text-primary hover:underline">5. Seus Direitos (LGPD)</a></li>
              <li><a href="#cookies" className="text-primary hover:underline">6. Cookies e Rastreamento</a></li>
              <li><a href="#children" className="text-primary hover:underline">7. Privacidade de Crianças</a></li>
              <li><a href="#changes" className="text-primary hover:underline">8. Alterações na Política</a></li>
              <li><a href="#contact" className="text-primary hover:underline">9. Contato do DPO</a></li>
            </ul>
          </nav>

          {/* Content sections */}
          <section id="collect" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">1. Informações que Coletamos</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Coletamos informações que você nos fornece diretamente e informações que coletamos automaticamente 
              quando você usa nossa plataforma.
            </p>
            <h3 className="text-lg font-medium mb-2">Informações que você nos fornece:</h3>
            <ul className="list-disc list-inside mb-4 text-muted-foreground">
              <li>Nome completo e informações de contato</li>
              <li>Informações de pagamento e assinatura</li>
              <li>Conteúdo que você cria e compartilha</li>
              <li>Comunicações conosco</li>
            </ul>
            <h3 className="text-lg font-medium mb-2">Informações coletadas automaticamente:</h3>
            <ul className="list-disc list-inside mb-4 text-muted-foreground">
              <li>Dados de uso da plataforma</li>
              <li>Informações do dispositivo e navegador</li>
              <li>Endereço IP e localização aproximada</li>
              <li>Cookies e tecnologias similares</li>
            </ul>
          </section>

          <section id="use" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">2. Como Usamos Suas Informações</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Usamos suas informações para:
            </p>
            <ul className="list-disc list-inside mb-4 text-muted-foreground">
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Processar pagamentos e assinaturas</li>
              <li>Comunicar com você sobre sua conta</li>
              <li>Enviar atualizações e notificações importantes</li>
              <li>Personalizar sua experiência na plataforma</li>
              <li>Prevenir fraudes e garantir a segurança</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section id="sharing" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">3. Compartilhamento de Informações</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
            </p>
            <ul className="list-disc list-inside mb-4 text-muted-foreground">
              <li>Com prestadores de serviços que nos ajudam a operar a plataforma</li>
              <li>Quando exigido por lei ou processo legal</li>
              <li>Para proteger nossos direitos e segurança</li>
              <li>Com seu consentimento explícito</li>
              <li>Em caso de fusão ou aquisição da empresa</li>
            </ul>
          </section>

          <section id="security" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">4. Segurança dos Dados</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
            </p>
            <ul className="list-disc list-inside mb-4 text-muted-foreground">
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Controles de acesso rigorosos</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Backups regulares e seguros</li>
              <li>Treinamento da equipe em práticas de segurança</li>
            </ul>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              No entanto, nenhum sistema é 100% seguro. Recomendamos que você também tome medidas 
              para proteger suas informações, como usar senhas fortes e não compartilhar credenciais.
            </p>
          </section>

          <section id="rights" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">5. Seus Direitos (LGPD)</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Conforme a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
            </p>
            <ul className="list-disc list-inside mb-4 text-muted-foreground">
              <li><strong>Confirmação e acesso:</strong> Saber se processamos seus dados e acessá-los</li>
              <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li><strong>Anonimização, bloqueio ou eliminação:</strong> Remover dados desnecessários</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Eliminação:</strong> Solicitar a exclusão de seus dados</li>
              <li><strong>Informação sobre compartilhamento:</strong> Saber com quem compartilhamos seus dados</li>
              <li><strong>Revogação do consentimento:</strong> Retirar o consentimento a qualquer momento</li>
            </ul>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Para exercer seus direitos, entre em contato conosco através do email: privacidade@betlink.com
            </p>
          </section>

          <section id="cookies" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">6. Cookies e Rastreamento</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Utilizamos cookies e tecnologias similares para:
            </p>
            <ul className="list-disc list-inside mb-4 text-muted-foreground">
              <li>Manter você logado na plataforma</li>
              <li>Lembrar suas preferências</li>
              <li>Analisar o uso da plataforma</li>
              <li>Melhorar a performance e funcionalidade</li>
            </ul>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Você pode controlar o uso de cookies através das configurações do seu navegador. 
              No entanto, desabilitar cookies pode afetar a funcionalidade da plataforma.
            </p>
          </section>

          <section id="children" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">7. Privacidade de Crianças</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Nossa plataforma não é destinada a menores de 18 anos. Não coletamos intencionalmente 
              informações pessoais de crianças menores de 18 anos.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Se você é pai ou responsável e acredita que seu filho nos forneceu informações pessoais, 
              entre em contato conosco imediatamente para que possamos remover essas informações.
            </p>
          </section>

          <section id="changes" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">8. Alterações na Política</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Quando fizermos alterações 
              significativas, notificaremos você através da plataforma ou por email.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Recomendamos que você revise esta política regularmente para se manter informado sobre 
              como protegemos suas informações.
            </p>
          </section>

          <section id="contact" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">9. Contato do DPO</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Para questões relacionadas à proteção de dados pessoais, entre em contato com nosso 
              Encarregado de Proteção de Dados (DPO):
            </p>
            <ul className="list-disc list-inside mb-4 text-muted-foreground">
              <li>Email: dpo@betlink.com</li>
              <li>Email alternativo: privacidade@betlink.com</li>
              <li>Endereço: São Paulo, SP, Brasil</li>
              <li>CNPJ: XX.XXX.XXX/0001-XX</li>
            </ul>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Você também tem o direito de apresentar uma reclamação à Autoridade Nacional de 
              Proteção de Dados (ANPD) se acreditar que seus direitos foram violados.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
} 