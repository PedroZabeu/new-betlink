"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, MessageCircle, Send } from "lucide-react";
import { MaskedInput } from "@/components/ui/masked-input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutData } from "../checkout-flow";
import { logger } from "@/lib/utils/logger";

const FEATURE_NAME = '[Feature 2.13: Contact Info]';

const contactSchema = z.object({
  whatsapp: z.string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Formato inválido. Use: (11) 98765-4321'),
  telegram: z.string()
    .min(5, 'Username muito curto')
    .regex(/^@/, 'Deve começar com @')
    .regex(/^@[a-zA-Z0-9_]+$/, 'Username inválido. Use apenas letras, números e _'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactInfoStepProps {
  checkoutData: CheckoutData;
  updateCheckoutData: (key: string, data: any) => void;
  onNext: () => void;
}

export function ContactInfoStep({ checkoutData, updateCheckoutData, onNext }: ContactInfoStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      whatsapp: checkoutData.contact?.whatsapp || '',
      telegram: checkoutData.contact?.telegram || '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    logger.info(`${FEATURE_NAME} Contact info submitted`, {
      hasWhatsapp: !!data.whatsapp,
      hasTelegram: !!data.telegram,
    });

    updateCheckoutData('contact', data);
    
    // Simular pequeno delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsSubmitting(false);
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações de Contato</CardTitle>
        <CardDescription>
          Precisamos dessas informações para adicionar você ao canal do Telegram e manter contato
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Essas informações são essenciais para você receber as tips do tipster. 
            O acesso ao canal será liberado automaticamente após o pagamento.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="whatsapp">
              <MessageCircle className="inline-block h-4 w-4 mr-1" />
              WhatsApp
            </Label>
            <MaskedInput
              mask="(99) 99999-9999"
              value={watch('whatsapp')}
              onChange={(value) => setValue('whatsapp', value)}
              id="whatsapp"
              placeholder="(11) 98765-4321"
              className={errors.whatsapp ? 'border-red-500' : ''}
            />
            {errors.whatsapp && (
              <p className="text-sm text-red-500">{errors.whatsapp.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Usado para comunicações importantes sobre sua assinatura
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegram">
              <Send className="inline-block h-4 w-4 mr-1" />
              Username do Telegram
            </Label>
            <Input
              id="telegram"
              placeholder="@seu_username"
              {...register('telegram')}
              className={errors.telegram ? 'border-red-500' : ''}
            />
            {errors.telegram && (
              <p className="text-sm text-red-500">{errors.telegram.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Necessário para adicionar você ao canal privado do tipster
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Por que precisamos dessas informações?</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• WhatsApp: Notificações de renovação e suporte</li>
              <li>• Telegram: Acesso ao canal exclusivo com as tips</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Continuar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}