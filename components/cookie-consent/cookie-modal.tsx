"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CookiePreferences } from "./cookie-banner";
import { Cookie, BarChart3, Megaphone, Shield } from "lucide-react";

interface CookieModalProps {
  preferences: CookiePreferences;
  onSave: (preferences: CookiePreferences) => void;
  onClose: () => void;
}

export function CookieModal({ preferences, onSave, onClose }: CookieModalProps) {
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(preferences);

  const handleSave = () => {
    onSave(localPreferences);
  };

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === "necessary") return; // Necessary cookies cannot be disabled
    
    setLocalPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            Preferências de Cookies
          </DialogTitle>
          <DialogDescription>
            Gerencie suas preferências de cookies. Usamos cookies para melhorar sua experiência 
            e fornecer funcionalidades personalizadas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Necessary Cookies */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <Label className="text-base font-semibold">Cookies Necessários</Label>
                  <p className="text-sm text-muted-foreground">
                    Estes cookies são essenciais para o funcionamento do site. Eles permitem 
                    funcionalidades básicas como navegação segura, autenticação e acesso a áreas 
                    protegidas. O site não pode funcionar adequadamente sem estes cookies.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Exemplos: Sessão de login, preferências de idioma, carrinho de compras
                  </p>
                </div>
              </div>
              <Switch
                checked={true}
                disabled
                className="mt-1"
              />
            </div>
          </div>

          <Separator />

          {/* Analytics Cookies */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <Label className="text-base font-semibold">Cookies de Análise</Label>
                  <p className="text-sm text-muted-foreground">
                    Estes cookies nos ajudam a entender como os visitantes interagem com nosso site, 
                    coletando informações de forma anônima. Isso nos permite melhorar continuamente 
                    nossa plataforma e a experiência do usuário.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Exemplos: Google Analytics, páginas visitadas, tempo de permanência, taxa de rejeição
                  </p>
                </div>
              </div>
              <Switch
                checked={localPreferences.analytics}
                onCheckedChange={() => handleToggle("analytics")}
                className="mt-1"
              />
            </div>
          </div>

          <Separator />

          {/* Marketing Cookies */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Megaphone className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <Label className="text-base font-semibold">Cookies de Marketing</Label>
                  <p className="text-sm text-muted-foreground">
                    Estes cookies são usados para rastrear visitantes em diferentes sites. 
                    A intenção é exibir anúncios relevantes e envolventes para o usuário individual, 
                    tornando-os mais valiosos para editores e anunciantes terceiros.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Exemplos: Facebook Pixel, Google Ads, remarketing, anúncios personalizados
                  </p>
                </div>
              </div>
              <Switch
                checked={localPreferences.marketing}
                onCheckedChange={() => handleToggle("marketing")}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="text-sm text-muted-foreground">
          <p>
            Para mais informações sobre como usamos cookies e processamos seus dados, 
            consulte nossa{" "}
            <a href="/privacidade" className="text-primary hover:underline">
              Política de Privacidade
            </a>
            .
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onSave({
                necessary: true,
                analytics: false,
                marketing: false,
              });
            }}
          >
            Aceitar Apenas Necessários
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onSave({
                necessary: true,
                analytics: true,
                marketing: true,
              });
            }}
          >
            Aceitar Todos
          </Button>
          <Button onClick={handleSave}>
            Salvar Preferências
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}