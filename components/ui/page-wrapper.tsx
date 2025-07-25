import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn("min-h-screen flex flex-col bg-gradient-to-b from-primary/10 to-background", className)}>
      {children}
    </div>
  );
}