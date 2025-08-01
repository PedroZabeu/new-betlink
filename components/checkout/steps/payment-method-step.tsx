"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, QrCode, FileText, Lock, Info } from "lucide-react";
import { MaskedInput } from "@/components/ui/masked-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { creditCardSchema } from "../utils/validation";
import { detectCardBrand } from "../utils/validation";
import { CheckoutData } from "../checkout-flow";
import { logger } from "@/lib/utils/logger";
import { z } from "zod";

const FEATURE_NAME = '[Feature 2.13: Payment Method]';

type CreditCardFormData = z.infer<typeof creditCardSchema>;

interface PaymentMethodStepProps {
  checkoutData: CheckoutData;
  updateCheckoutData: (key: string, data: any) => void;
  onNext: () => void;
}

export function PaymentMethodStep({ checkoutData, updateCheckoutData, onNext }: PaymentMethodStepProps) {
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card');
  const [cardBrand, setCardBrand] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveCard, setSaveCard] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreditCardFormData>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      number: '',
      holder: '',
      expiry: '',
      cvv: '',
    },
  });

  const handleCardNumberChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const brand = detectCardBrand(cleanValue);
    setCardBrand(brand);
  };

  const handleCreditCardSubmit = async (data: CreditCardFormData) => {
    setIsSubmitting(true);
    
    logger.info(`${FEATURE_NAME} Credit card payment selected`, {
      brand: cardBrand,
      saveCard,
    });

    updateCheckoutData('payment', {
      method: 'credit_card',
      cardData: {
        ...data,
        brand: cardBrand,
      },
      saveCard,
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSubmitting(false);
    onNext();
  };

  const handleAlternativePayment = async () => {
    setIsSubmitting(true);
    
    logger.info(`${FEATURE_NAME} Alternative payment selected`, {
      method: paymentMethod,
    });

    updateCheckoutData('payment', {
      method: paymentMethod,
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSubmitting(false);
    onNext();
  };

  const getCardBrandIcon = () => {
    const icons: Record<string, string> = {
      visa: "💳",
      mastercard: "💳",
      amex: "💳",
      elo: "💳",
    };
    return icons[cardBrand] || "💳";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Método de Pagamento</CardTitle>
        <CardDescription>
          Escolha como deseja pagar sua assinatura
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="credit_card">
              <CreditCard className="h-4 w-4 mr-2" />
              Cartão
            </TabsTrigger>
            <TabsTrigger value="pix">
              <QrCode className="h-4 w-4 mr-2" />
              PIX
            </TabsTrigger>
            <TabsTrigger value="boleto">
              <FileText className="h-4 w-4 mr-2" />
              Boleto
            </TabsTrigger>
          </TabsList>

          <TabsContent value="credit_card" className="space-y-4">
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Seus dados de pagamento são criptografados e processados com segurança
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit(handleCreditCardSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="number">Número do cartão</Label>
                <div className="relative">
                  <MaskedInput
                    mask="9999 9999 9999 9999"
                    value={watch('number')}
                    onChange={(value) => {
                      setValue('number', value);
                      handleCardNumberChange(value);
                    }}
                    id="number"
                    placeholder="1234 5678 9012 3456"
                    className={errors.number ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  {cardBrand && (
                    <span className="absolute right-3 top-2.5 text-lg">
                      {getCardBrandIcon()}
                    </span>
                  )}
                </div>
                {errors.number && (
                  <p className="text-sm text-red-500">{errors.number.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="holder">Nome no cartão</Label>
                <Input
                  id="holder"
                  {...register('holder')}
                  placeholder="JOÃO SILVA"
                  className={errors.holder ? 'border-red-500' : ''}
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.holder && (
                  <p className="text-sm text-red-500">{errors.holder.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Validade</Label>
                  <MaskedInput
                    mask="99/99"
                    value={watch('expiry')}
                    onChange={(value) => setValue('expiry', value)}
                    id="expiry"
                    placeholder="MM/AA"
                    className={errors.expiry ? 'border-red-500' : ''}
                  />
                  {errors.expiry && (
                    <p className="text-sm text-red-500">{errors.expiry.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <MaskedInput
                    mask={cardBrand === 'amex' ? "9999" : "999"}
                    value={watch('cvv')}
                    onChange={(value) => setValue('cvv', value)}
                    id="cvv"
                    placeholder="123"
                    className={errors.cvv ? 'border-red-500' : ''}
                  />
                  {errors.cvv && (
                    <p className="text-sm text-red-500">{errors.cvv.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveCard"
                  checked={saveCard}
                  onCheckedChange={(checked) => setSaveCard(checked as boolean)}
                />
                <Label htmlFor="saveCard" className="cursor-pointer">
                  Salvar cartão para próximas compras
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processando..." : "Continuar"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="pix" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Após confirmar, você terá 30 minutos para realizar o pagamento via PIX
              </AlertDescription>
            </Alert>

            <div className="text-center space-y-4 py-8">
              <QrCode className="h-24 w-24 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="font-semibold">Pagamento via PIX</h3>
                <p className="text-sm text-muted-foreground">
                  O QR Code será gerado após a confirmação do pedido
                </p>
              </div>
            </div>

            <Button
              onClick={handleAlternativePayment}
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processando..." : "Gerar QR Code PIX"}
            </Button>
          </TabsContent>

          <TabsContent value="boleto" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                O boleto será enviado para seu email e terá vencimento em 3 dias úteis
              </AlertDescription>
            </Alert>

            <div className="text-center space-y-4 py-8">
              <FileText className="h-24 w-24 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="font-semibold">Pagamento via Boleto</h3>
                <p className="text-sm text-muted-foreground">
                  O boleto será gerado após a confirmação do pedido
                </p>
              </div>
            </div>

            <Button
              onClick={handleAlternativePayment}
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processando..." : "Gerar Boleto"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}