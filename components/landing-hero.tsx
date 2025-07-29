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
    </section>
  );
}