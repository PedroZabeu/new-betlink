export function LandingHero() {
  return (
    <section className="flex flex-col gap-8 items-center py-16">
      <h1 className="text-4xl lg:text-6xl font-bold text-center max-w-4xl">
        Conecte-se aos Melhores Tipsters de Apostas Esportivas
      </h1>
      
      <p className="text-lg lg:text-xl text-muted-foreground text-center max-w-2xl">
        Descubra tipsters profissionais verificados, assine seus canais exclusivos 
        e receba tips de alta qualidade diretamente no Telegram.
      </p>
      
      <div className="flex gap-4 mt-8">
        <a
          href="/canais"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Explorar Tipsters
        </a>
        <a
          href="/auth/sign-up"
          className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
        >
          Começar Gratuitamente
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-4xl">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">500+</div>
          <p className="text-sm text-muted-foreground mt-1">Tipsters Verificados</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">85%</div>
          <p className="text-sm text-muted-foreground mt-1">Taxa de Acerto Média</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">24/7</div>
          <p className="text-sm text-muted-foreground mt-1">Suporte ao Cliente</p>
        </div>
      </div>
    </section>
  );
}