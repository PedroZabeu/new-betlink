"use client";

import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChannelCard as ChannelType } from "@/lib/types/channel";

interface CheckoutHeaderProps {
  channel: ChannelType;
  currentStep: number;
  totalSteps: number;
  steps: Array<{ id: string; title: string }>;
}

export function CheckoutHeader({ channel, currentStep, totalSteps, steps }: CheckoutHeaderProps) {
  const router = useRouter();

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
              {channel.avatar}
            </div>
            <div>
              <h1 className="font-semibold text-lg">Assinando {channel.name}</h1>
              <p className="text-sm text-muted-foreground">por {channel.tipster}</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="pb-4">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                      index < currentStep
                        ? "bg-primary text-primary-foreground"
                        : index === currentStep
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "ml-2 text-sm font-medium hidden sm:inline-block",
                      index <= currentStep ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full bg-primary transition-all duration-300",
                          index < currentStep ? "w-full" : "w-0"
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}