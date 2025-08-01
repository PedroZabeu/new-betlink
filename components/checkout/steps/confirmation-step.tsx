"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  CreditCard, 
  QrCode, 
  FileText, 
  User, 
  Phone, 
  MapPin,
  ShieldCheck 
} from "lucide-react";
import { CheckoutData } from "../checkout-flow";
import { ChannelCard as ChannelType } from "@/lib/types/channel";
import { ChannelDetail } from "@/lib/data/mock-channel-details";
import { processPayment } from "../utils/mock-services";
import { logger } from "@/lib/utils/logger";
import { toast } from "sonner";

const FEATURE_NAME = '[Feature 2.13: Confirmation]';

interface ConfirmationStepProps {
  channel: ChannelType;
  channelDetail: ChannelDetail;
  checkoutData: CheckoutData;
  onComplete: () => void;
}

export function ConfirmationStep({ 
  channel, 
  channelDetail, 
  checkoutData, 
  onComplete 
}: ConfirmationStepProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");

  const handleConfirm = async () => {
    if (!termsAccepted) {
      toast.error("Você precisa aceitar os termos para continuar");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing steps
      setProcessingStep("Validando dados...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep("Processando pagamento...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessingStep("Confirmando assinatura...");
      const result = await processPayment({
        method: checkoutData.payment?.method,
        amount: checkoutData.subscription?.price,
        channel: channel.name,
      });

      if (result.success) {
        logger.info(`${FEATURE_NAME} Payment successful`, {
          orderId: result.orderId,
          transactionId: result.transactionId,
        });
        
        setProcessingStep("Concluído!");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        onComplete();
      } else {
        throw new Error(result.error || "Erro no pagamento");
      }
    } catch (error: any) {
      logger.error(`${FEATURE_NAME} Payment failed`, error);
      toast.error(error.message || "Erro ao processar pagamento");
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  const getPaymentIcon = () => {
    switch (checkoutData.payment?.method) {
      case 'credit_card':
        return <CreditCard className="h-5 w-5" />;
      case 'pix':
        return <QrCode className="h-5 w-5" />;
      case 'boleto':
        return <FileText className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getPaymentLabel = () => {
    switch (checkoutData.payment?.method) {
      case 'credit_card':
        const cardData = checkoutData.payment.cardData;
        return `Cartão ${cardData?.brand || ''} terminado em ${cardData?.number.slice(-4)}`;
      case 'pix':
        return 'PIX - Pagamento instantâneo';
      case 'boleto':
        return 'Boleto Bancário';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revise e Confirme sua Assinatura</CardTitle>
        <CardDescription>
          Verifique todos os dados antes de finalizar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="space-y-4">
          <h3 className="font-semibold">Resumo do Pedido</h3>
          
          {/* Channel Info */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
              {channel.avatar}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{channel.name}</h4>
              <p className="text-sm text-muted-foreground">por {channel.tipster}</p>
              <Badge variant="secondary" className="mt-1">
                {checkoutData.subscription?.planName}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                R$ {checkoutData.subscription?.price.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                {checkoutData.subscription?.duration} dias
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Informações de Contato
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">WhatsApp</p>
              <p className="font-medium">{checkoutData.contact?.whatsapp}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Telegram</p>
              <p className="font-medium">{checkoutData.contact?.telegram}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Billing Info */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            Dados de Faturamento
          </h3>
          <div className="text-sm space-y-2">
            <div>
              <p className="text-muted-foreground">CPF</p>
              <p className="font-medium">{checkoutData.billing?.cpf}</p>
            </div>
            <div>
              <p className="text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Endereço
              </p>
              <p className="font-medium">
                {checkoutData.billing?.address.street}, {checkoutData.billing?.address.number}
                {checkoutData.billing?.address.complement && ` - ${checkoutData.billing.address.complement}`}
              </p>
              <p className="font-medium">
                {checkoutData.billing?.address.neighborhood} - {checkoutData.billing?.address.city}/{checkoutData.billing?.address.state}
              </p>
              <p className="font-medium">CEP: {checkoutData.billing?.address.zipCode}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Payment Method */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            {getPaymentIcon()}
            Método de Pagamento
          </h3>
          <p className="font-medium">{getPaymentLabel()}</p>
        </div>

        <Separator />

        {/* Terms */}
        <Alert>
          <ShieldCheck className="h-4 w-4" />
          <AlertDescription>
            Ao confirmar, você concorda com nossa política de privacidade e termos de uso. 
            Você pode cancelar sua assinatura a qualquer momento.
          </AlertDescription>
        </Alert>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
          />
          <Label htmlFor="terms" className="cursor-pointer">
            Li e aceito os termos de uso e política de privacidade
          </Label>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          className="w-full"
          size="lg"
          disabled={!termsAccepted || isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              {processingStep}
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Confirmar Assinatura
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}