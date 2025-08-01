"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { ChannelCard as ChannelType } from "@/lib/types/channel";
import { ChannelDetail } from "@/lib/data/mock-channel-details";
import { CheckoutHeader } from "./checkout-header";
import { CheckoutSidebar } from "./checkout-sidebar";
import { AuthStep } from "./steps/auth-step";
import { PlanSelectionStep } from "./steps/plan-selection-step";
import { ContactInfoStep } from "./steps/contact-info-step";
import { BillingInfoStep } from "./steps/billing-info-step";
import { PaymentMethodStep } from "./steps/payment-method-step";
import { ConfirmationStep } from "./steps/confirmation-step";
import { StepNavigation } from "./ui/step-navigation";
import { logger } from "@/lib/utils/logger";
import { toast } from "sonner";

const FEATURE_NAME = '[Feature 2.13: Checkout Flow]';

interface CheckoutFlowProps {
  channel: ChannelType;
  channelDetail: ChannelDetail;
  preSelectedPlan?: string;
  source: string;
}

export interface CheckoutData {
  user: {
    id: string;
    email: string;
    name?: string;
  } | null;
  subscription: {
    channelId: string;
    planId: string;
    planName: string;
    price: number;
    duration: number;
  } | null;
  contact: {
    whatsapp: string;
    telegram: string;
  } | null;
  billing: {
    cpf: string;
    address: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
    saveForFuture: boolean;
  } | null;
  payment: {
    method: 'credit_card' | 'pix' | 'boleto';
    cardData?: {
      number: string;
      holder: string;
      expiry: string;
      cvv: string;
    };
    saveCard?: boolean;
  } | null;
}

const CHECKOUT_STORAGE_KEY = 'betlink_checkout_data';

export function CheckoutFlow({ channel, channelDetail, preSelectedPlan, source }: CheckoutFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    user: null,
    subscription: null,
    contact: null,
    billing: null,
    payment: null,
  });

  // Verificar autenticação e recuperar dados salvos
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        setCheckoutData(prev => ({
          ...prev,
          user: {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name,
          }
        }));
        
        // Se usuário está logado, pular para seleção de plano
        setCurrentStep(1);
      }

      // Recuperar dados salvos do localStorage
      const savedData = localStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.channelId === channel.id) {
            setCheckoutData(prev => ({ ...prev, ...parsed.data }));
            logger.info(`${FEATURE_NAME} Recovered abandoned checkout`, {
              channelId: channel.id,
              lastStep: parsed.lastStep
            });
            toast.info("Recuperamos seus dados anteriores!");
          }
        } catch (error) {
          logger.error(`${FEATURE_NAME} Error recovering checkout data`, error as Error);
        }
      }

      // Se tem plano pré-selecionado
      if (preSelectedPlan) {
        const plan = channelDetail.subscriptionPlans.find(p => p.id === preSelectedPlan);
        if (plan) {
          setCheckoutData(prev => ({
            ...prev,
            subscription: {
              channelId: channel.id,
              planId: plan.id,
              planName: plan.name,
              price: plan.price,
              duration: plan.duration,
            }
          }));
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [channel, channelDetail, preSelectedPlan]);

  // Salvar progresso no localStorage
  useEffect(() => {
    if (currentStep > 0) {
      const dataToSave = {
        channelId: channel.id,
        lastStep: currentStep,
        data: checkoutData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [currentStep, checkoutData, channel.id]);

  const updateCheckoutData = (key: keyof CheckoutData, data: any) => {
    setCheckoutData(prev => ({ ...prev, [key]: data }));
  };

  const handleNext = () => {
    logger.info(`${FEATURE_NAME} Step completed`, {
      step: currentStep,
      nextStep: currentStep + 1
    });
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleComplete = async () => {
    logger.info(`${FEATURE_NAME} Checkout completed`, {
      channelId: channel.id,
      plan: checkoutData.subscription?.planName,
      price: checkoutData.subscription?.price,
      paymentMethod: checkoutData.payment?.method
    });

    // Limpar dados do localStorage
    localStorage.removeItem(CHECKOUT_STORAGE_KEY);

    // Simular captura de lead
    const leadData = {
      ...checkoutData,
      capturedAt: new Date().toISOString(),
      source,
      channelName: channel.name,
      tipster: channel.tipster
    };

    // Salvar no localStorage como "lead capturado"
    const existingLeads = localStorage.getItem('captured_leads');
    const leads = existingLeads ? JSON.parse(existingLeads) : [];
    leads.push(leadData);
    localStorage.setItem('captured_leads', JSON.stringify(leads));

    toast.success("Assinatura confirmada com sucesso!");
    
    // Redirecionar após 2 segundos
    setTimeout(() => {
      router.push('/cliente/dashboard');
    }, 2000);
  };

  const steps = [
    { id: 'auth', title: 'Login', component: AuthStep },
    { id: 'plan', title: 'Plano', component: PlanSelectionStep },
    { id: 'contact', title: 'Contato', component: ContactInfoStep },
    { id: 'billing', title: 'Faturamento', component: BillingInfoStep },
    { id: 'payment', title: 'Pagamento', component: PaymentMethodStep },
    { id: 'confirmation', title: 'Confirmação', component: ConfirmationStep },
  ];

  // Se usuário está logado, remover step de auth
  const activeSteps = user ? steps.slice(1) : steps;
  const adjustedStep = user ? currentStep : currentStep;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const CurrentStepComponent = activeSteps[adjustedStep]?.component;

  return (
    <div className="min-h-screen bg-background">
      <CheckoutHeader 
        channel={channel}
        currentStep={adjustedStep}
        totalSteps={activeSteps.length}
        steps={activeSteps}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={adjustedStep}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {CurrentStepComponent && (
                  <CurrentStepComponent
                    channel={channel}
                    channelDetail={channelDetail}
                    checkoutData={checkoutData}
                    updateCheckoutData={updateCheckoutData}
                    onNext={handleNext}
                    onComplete={handleComplete}
                    user={user}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <StepNavigation
              currentStep={adjustedStep}
              totalSteps={activeSteps.length}
              onBack={handleBack}
              onNext={handleNext}
              canGoBack={adjustedStep > 0}
              canGoNext={false} // Will be controlled by each step
            />
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block">
            <CheckoutSidebar
              channel={channel}
              checkoutData={checkoutData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}