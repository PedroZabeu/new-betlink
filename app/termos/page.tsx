import { Header } from "@/components/header";

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
              <li><a href="#service" className="text-primary hover:underline">2. Descrição do Serviço</a></li>
              <li><a href="#accounts" className="text-primary hover:underline">3. Contas de Usuário</a></li>
              <li><a href="#prohibited" className="text-primary hover:underline">4. Usos Proibidos</a></li>
              <li><a href="#intellectual" className="text-primary hover:underline">5. Propriedade Intelectual</a></li>
              <li><a href="#disclaimers" className="text-primary hover:underline">6. Exclusões de Responsabilidade</a></li>
              <li><a href="#liability" className="text-primary hover:underline">7. Limitação de Responsabilidade</a></li>
              <li><a href="#governing" className="text-primary hover:underline">8. Lei Aplicável</a></li>
              <li><a href="#changes" className="text-primary hover:underline">9. Alterações nos Termos</a></li>
              <li><a href="#contact" className="text-primary hover:underline">10. Informações de Contato</a></li>
            </ul>
          </nav>

          {/* Content sections */}
          <section id="acceptance" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Ao acessar e usar a plataforma BetLink, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Estes termos constituem um acordo legal entre você e a BetLink Tecnologia Ltda, uma empresa brasileira 
              registrada sob o CNPJ XX.XXX.XXX/0001-XX, com sede em São Paulo, SP, Brasil.
            </p>
          </section>

          <section id="service" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">2. Descrição do Serviço</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              O BetLink é uma plataforma que conecta tipsters (especialistas em apostas esportivas) com usuários 
              interessados em receber dicas e análises. Nossa plataforma oferece:
            </p>
            <ul className="list-disc list-inside mb-4 text-muted-foreground">
              <li>Análises e dicas de apostas esportivas</li>
              <li>Plataforma para tipsters compartilharem conhecimento</li>
              <li>Sistema de assinaturas e pagamentos</li>
              <li>Ferramentas de análise e métricas</li>
            </ul>
          </section>

          <section id="accounts" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">3. Contas de Usuário</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Para usar certos recursos da plataforma, você deve criar uma conta. Você é responsável por:
            </p>
            <ul className="list-disc list-inside mb-4 text-muted-foreground">
              <li>Manter a confidencialidade de suas credenciais de login</li>
              <li>Fornecer informações precisas e atualizadas</li>
              <li>Ser responsável por todas as atividades em sua conta</li>
              <li>Notificar-nos imediatamente sobre uso não autorizado</li>
            </ul>
          </section>

          <section id="prohibited" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">4. Usos Proibidos</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Você concorda em não usar a plataforma para:
            </p>
            <ul className="list-disc list-inside mb-4 text-muted-foreground">
              <li>Atividades ilegais ou fraudulentas</li>
              <li>Violar direitos de propriedade intelectual</li>
              <li>Transmitir conteúdo ofensivo ou prejudicial</li>
              <li>Interferir na operação da plataforma</li>
              <li>Coletar dados de outros usuários sem autorização</li>
            </ul>
          </section>

          <section id="intellectual" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">5. Propriedade Intelectual</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              A plataforma BetLink e todo seu conteúdo, incluindo mas não se limitando a textos, gráficos, 
              logotipos, ícones e software, são propriedade da BetLink Tecnologia Ltda ou de seus licenciadores.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Você mantém os direitos sobre o conteúdo que criar e compartilhar na plataforma, mas concede 
              à BetLink uma licença não exclusiva para usar, reproduzir e distribuir esse conteúdo.
            </p>
          </section>

          <section id="disclaimers" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">6. Exclusões de Responsabilidade</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              A BetLink fornece a plataforma &quot;como está&quot; e &quot;conforme disponível&quot;. Não garantimos que:
            </p>
            <ul className="list-disc list-inside mb-4 text-muted-foreground">
              <li>A plataforma estará sempre disponível ou livre de erros</li>
              <li>As dicas e análises serão precisas ou lucrativas</li>
              <li>Os resultados das apostas serão favoráveis</li>
              <li>A plataforma atenderá a todas as suas necessidades</li>
            </ul>
          </section>

          <section id="liability" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">7. Limitação de Responsabilidade</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Em nenhuma circunstância a BetLink será responsável por danos indiretos, incidentais, 
              especiais ou consequenciais, incluindo perda de lucros, dados ou uso.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Nossa responsabilidade total será limitada ao valor pago por você pelos serviços nos 
              12 meses anteriores ao evento que deu origem à responsabilidade.
            </p>
          </section>

          <section id="governing" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">8. Lei Aplicável</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
              Qualquer disputa será resolvida nos tribunais da comarca de São Paulo, SP.
            </p>
          </section>

          <section id="changes" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">9. Alterações nos Termos</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. 
              Alterações significativas serão comunicadas através da plataforma ou por email.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              O uso continuado da plataforma após as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section id="contact" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">10. Informações de Contato</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Para dúvidas sobre estes Termos de Uso, entre em contato conosco:
            </p>
            <ul className="list-disc list-inside mb-4 text-muted-foreground">
              <li>Email: legal@betlink.com</li>
              <li>Endereço: São Paulo, SP, Brasil</li>
              <li>CNPJ: XX.XXX.XXX/0001-XX</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
} 