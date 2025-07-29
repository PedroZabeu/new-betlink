// Feature 2.10: Melhorias de Performance e UX - Scroll to Top Button
// @feature: Performance Optimization
// @created: Feature 2.10

"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logger } from '@/lib/utils/logger';

const FEATURE_NAME = '[Feature: ScrollToTop]';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const shouldShow = window.scrollY > 300;
      
      if (shouldShow !== isVisible) {
        setIsVisible(shouldShow);
        logger.debug(`${FEATURE_NAME} Visibility changed`, { 
          scrollY: window.scrollY, 
          isVisible: shouldShow 
        });
      }
    };

    // Check initial scroll position
    toggleVisibility();

    // Add scroll listener with throttling for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          toggleVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isVisible]);

  const scrollToTop = () => {
    logger.info(`${FEATURE_NAME} Scroll to top triggered`, { 
      currentScrollY: window.scrollY 
    });
    
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-8 right-8 z-50 shadow-lg transition-all duration-300 hover:scale-110"
      onClick={scrollToTop}
      aria-label="Voltar ao topo da página"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
}