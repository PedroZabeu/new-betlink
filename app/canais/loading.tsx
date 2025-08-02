import { Header } from "@/components/header";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

export default function CanaisLoading() {
  return (
    <PageWrapper>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Descubra os Melhores Tipsters
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Explore nossa seleção de tipsters verificados e encontre o canal perfeito 
                para suas apostas. Todos com histórico comprovado e métricas transparentes.
              </p>
            </div>
          </div>
        </section>

        {/* Channels Section Skeleton */}
        <section className="container mx-auto px-4 pb-20">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Skeleton */}
            <aside className="hidden lg:block lg:w-64 space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </aside>

            {/* Main Content Skeleton */}
            <div className="flex-1">
              {/* Header Skeleton */}
              <div className="mb-6">
                <Skeleton className="h-8 w-48" />
              </div>

              {/* Search and Sort Skeleton */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-4">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-32 lg:hidden" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-44" />
                </div>
              </div>

              {/* Channels Grid Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageWrapper>
  );
}