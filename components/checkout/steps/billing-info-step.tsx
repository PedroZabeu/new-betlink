"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, CreditCard } from "lucide-react";
import { MaskedInput } from "@/components/ui/masked-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { billingSchema } from "../utils/validation";
import { fetchAddress } from "../utils/mock-services";
import { CheckoutData } from "../checkout-flow";
import { logger } from "@/lib/utils/logger";
import { toast } from "sonner";
import { z } from "zod";

const FEATURE_NAME = '[Feature 2.13: Billing Info]';

type BillingFormData = z.infer<typeof billingSchema>;

interface BillingInfoStepProps {
  checkoutData: CheckoutData;
  updateCheckoutData: (key: string, data: any) => void;
  onNext: () => void;
}

export function BillingInfoStep({ checkoutData, updateCheckoutData, onNext }: BillingInfoStepProps) {
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<BillingFormData>({
    resolver: zodResolver(billingSchema),
    defaultValues: checkoutData.billing || {
      cpf: '',
      address: {
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
      },
      saveForFuture: true,
    },
  });

  // Check for saved billing data
  useEffect(() => {
    const savedBilling = localStorage.getItem('saved_billing_data');
    if (savedBilling && !checkoutData.billing) {
      const parsed = JSON.parse(savedBilling);
      setHasSavedData(true);
      
      // Auto-fill with saved data
      Object.keys(parsed).forEach((key) => {
        if (key === 'address') {
          Object.keys(parsed.address).forEach((addressKey) => {
            setValue(`address.${addressKey as any}`, parsed.address[addressKey]);
          });
        } else {
          setValue(key as any, parsed[key]);
        }
      });
    }
  }, [checkoutData.billing, setValue]);

  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      
      try {
        const result = await fetchAddress(cep);
        
        if (result.success && result.data) {
          setValue('address.street', result.data.street);
          setValue('address.neighborhood', result.data.neighborhood);
          setValue('address.city', result.data.city);
          setValue('address.state', result.data.state);
          
          // Trigger validation for the filled fields
          await trigger(['address.street', 'address.neighborhood', 'address.city', 'address.state']);
          
          toast.success("Endereço encontrado!");
          
          // Focus on number field
          const numberField = document.getElementById('number');
          if (numberField) numberField.focus();
        }
      } catch (error) {
        logger.error(`${FEATURE_NAME} CEP lookup failed`, error as Error);
        toast.error("Erro ao buscar CEP");
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const onSubmit = async (data: BillingFormData) => {
    setIsSubmitting(true);
    
    logger.info(`${FEATURE_NAME} Billing info submitted`, {
      hasCpf: !!data.cpf,
      hasAddress: !!data.address,
      saveForFuture: data.saveForFuture,
    });

    // Save to localStorage if requested
    if (data.saveForFuture) {
      localStorage.setItem('saved_billing_data', JSON.stringify(data));
    }

    updateCheckoutData('billing', data);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsSubmitting(false);
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações de Faturamento</CardTitle>
        <CardDescription>
          Precisamos dessas informações para emitir sua nota fiscal
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasSavedData && (
          <Alert className="mb-6">
            <CreditCard className="h-4 w-4" />
            <AlertDescription>
              Usamos seus dados salvos da última compra. Você pode alterá-los se necessário.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <MaskedInput
              mask="999.999.999-99"
              value={watch('cpf')}
              onChange={(value) => setValue('cpf', value)}
              id="cpf"
              placeholder="123.456.789-00"
              className={errors.cpf ? 'border-red-500' : ''}
            />
            {errors.cpf && (
              <p className="text-sm text-red-500">{errors.cpf.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Endereço
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <div className="relative">
                  <MaskedInput
                    mask="99999-999"
                    value={watch('address.zipCode')}
                    onChange={(value) => {
                      setValue('address.zipCode', value);
                      handleCepChange(value);
                    }}
                    id="zipCode"
                    placeholder="12345-678"
                    className={errors.address?.zipCode ? 'border-red-500' : ''}
                  />
                  {isLoadingCep && (
                    <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin" />
                  )}
                </div>
                {errors.address?.zipCode && (
                  <p className="text-sm text-red-500">{errors.address.zipCode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  {...register('address.state')}
                  placeholder="SP"
                  maxLength={2}
                  className={errors.address?.state ? 'border-red-500' : ''}
                />
                {errors.address?.state && (
                  <p className="text-sm text-red-500">{errors.address.state.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                {...register('address.street')}
                placeholder="Av. Paulista"
                className={errors.address?.street ? 'border-red-500' : ''}
              />
              {errors.address?.street && (
                <p className="text-sm text-red-500">{errors.address.street.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  {...register('address.number')}
                  placeholder="123"
                  className={errors.address?.number ? 'border-red-500' : ''}
                />
                {errors.address?.number && (
                  <p className="text-sm text-red-500">{errors.address.number.message}</p>
                )}
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="complement">Complemento (opcional)</Label>
                <Input
                  id="complement"
                  {...register('address.complement')}
                  placeholder="Apto 101"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  {...register('address.neighborhood')}
                  placeholder="Centro"
                  className={errors.address?.neighborhood ? 'border-red-500' : ''}
                />
                {errors.address?.neighborhood && (
                  <p className="text-sm text-red-500">{errors.address.neighborhood.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  {...register('address.city')}
                  placeholder="São Paulo"
                  className={errors.address?.city ? 'border-red-500' : ''}
                />
                {errors.address?.city && (
                  <p className="text-sm text-red-500">{errors.address.city.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveForFuture"
              checked={watch('saveForFuture')}
              onCheckedChange={(checked) => setValue('saveForFuture', checked as boolean)}
            />
            <Label htmlFor="saveForFuture" className="cursor-pointer">
              Salvar dados para próximas compras
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting || isLoadingCep}
          >
            {isSubmitting ? "Salvando..." : "Continuar para pagamento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}