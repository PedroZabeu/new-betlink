import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("flex-1 space-y-4 p-4 md:p-8 pt-6", className)}>
      {children}
    </div>
  );
}