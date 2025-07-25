"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cookie, Settings, X } from "lucide-react";
import { CookieModal } from "./cookie-modal";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  acceptedAt?: string;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true, // Always true
  analytics: false,
  marketing: false,
};

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    // Check if user has already made a choice
    const stored = localStorage.getItem("cookie-preferences");
    if (!stored) {
      // Small delay to prevent banner from appearing immediately
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      try {
        const parsed = JSON.parse(stored);
        setPreferences(parsed);
      } catch (e) {
        console.error("Failed to parse cookie preferences:", e);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    const toSave = {
      ...prefs,
      acceptedAt: new Date().toISOString(),
    };
    localStorage.setItem("cookie-preferences", JSON.stringify(toSave));
    setPreferences(toSave);
    setShowBanner(false);
    setShowModal(false);
  };

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const acceptNecessaryOnly = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
        <Card className="mx-auto max-w-4xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Cookie className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Cookies e Privacidade</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Usamos cookies para melhorar sua experiência, analisar o tráfego do site e personalizar conteúdo. 
                Ao clicar em "Aceitar Todos", você concorda com o uso de TODOS os cookies. 
                Você pode gerenciar suas preferências clicando em "Personalizar".
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Personalizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={acceptNecessaryOnly}
              >
                Apenas Necessários
              </Button>
              <Button
                size="sm"
                onClick={acceptAll}
              >
                Aceitar Todos
              </Button>
            </div>

            <button
              onClick={() => setShowBanner(false)}
              className="absolute top-2 right-2 md:relative md:top-0 md:right-0 text-muted-foreground hover:text-foreground"
              aria-label="Fechar banner de cookies"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </Card>
      </div>

      {/* Cookie Preferences Modal */}
      {showModal && (
        <CookieModal
          preferences={preferences}
          onSave={savePreferences}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}