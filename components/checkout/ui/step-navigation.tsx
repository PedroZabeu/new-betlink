"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  nextLabel?: string;
  isLoading?: boolean;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  canGoBack,
  canGoNext,
  nextLabel = "Próximo",
  isLoading = false,
}: StepNavigationProps) {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={!canGoBack || isLoading}
        className="gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar
      </Button>

      <span className="text-sm text-muted-foreground">
        Passo {currentStep + 1} de {totalSteps}
      </span>

      <Button
        onClick={onNext}
        disabled={!canGoNext || isLoading}
        className="gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            Processando...
          </>
        ) : (
          <>
            {isLastStep ? "Confirmar" : nextLabel}
            {!isLastStep && <ChevronRight className="h-4 w-4" />}
          </>
        )}
      </Button>
    </div>
  );
}