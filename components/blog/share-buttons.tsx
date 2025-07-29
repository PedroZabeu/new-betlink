// Feature 2.8: Páginas Individuais de Posts - Share Buttons Component
// @feature: Individual Post Pages
// @created: Feature 2.8

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Link2, 
  MessageCircle, 
  Send, 
  Check,
  Facebook,
  Twitter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/utils/logger';

const FEATURE_NAME = '[Feature: ShareButtons]';

interface ShareButtonsProps {
  url: string;
  title: string;
  excerpt: string;
  className?: string;
}

export function ShareButtons({ 
  url, 
  title, 
  excerpt, 
  className 
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  const shareWhatsApp = () => {
    try {
      const text = `${title} - ${url}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      logger.info(`${FEATURE_NAME} WhatsApp share clicked`, { 
        title, 
        url 
      });
    } catch (error) {
      logger.error(`${FEATURE_NAME} Error sharing to WhatsApp`, error as Error, {
        title,
        url
      });
    }
  };

  const shareTelegram = () => {
    try {
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
      window.open(telegramUrl, '_blank', 'noopener,noreferrer');
      
      logger.info(`${FEATURE_NAME} Telegram share clicked`, { 
        title, 
        url 
      });
    } catch (error) {
      logger.error(`${FEATURE_NAME} Error sharing to Telegram`, error as Error, {
        title,
        url
      });
    }
  };
  
  const shareTwitter = () => {
    try {
      const text = `${title} - ${excerpt.slice(0, 100)}...`;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');
      
      logger.info(`${FEATURE_NAME} Twitter share clicked`, { 
        title, 
        url 
      });
    } catch (error) {
      logger.error(`${FEATURE_NAME} Error sharing to Twitter`, error as Error, {
        title,
        url
      });
    }
  };
  
  const shareFacebook = () => {
    try {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(facebookUrl, '_blank', 'noopener,noreferrer');
      
      logger.info(`${FEATURE_NAME} Facebook share clicked`, { 
        title, 
        url 
      });
    } catch (error) {
      logger.error(`${FEATURE_NAME} Error sharing to Facebook`, error as Error, {
        title,
        url
      });
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      logger.info(`${FEATURE_NAME} Link copied to clipboard`, { 
        title, 
        url 
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      logger.error(`${FEATURE_NAME} Error copying link`, error as Error, {
        title,
        url
      });
      
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        logger.error(`${FEATURE_NAME} Fallback copy also failed`, fallbackError as Error);
      }
    }
  };

  return (
    <div className={cn(
      "flex flex-wrap gap-2 mb-6",
      className
    )}>
      <div className="text-sm text-muted-foreground mb-2 w-full">
        Compartilhar este post:
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={shareWhatsApp}
        className="text-green-600 hover:text-green-700 hover:border-green-300"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        WhatsApp
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={shareTelegram}
        className="text-blue-600 hover:text-blue-700 hover:border-blue-300"
      >
        <Send className="h-4 w-4 mr-2" />
        Telegram
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={shareTwitter}
        className="text-sky-600 hover:text-sky-700 hover:border-sky-300"
      >
        <Twitter className="h-4 w-4 mr-2" />
        Twitter
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={shareFacebook}
        className="text-blue-800 hover:text-blue-900 hover:border-blue-300"
      >
        <Facebook className="h-4 w-4 mr-2" />
        Facebook
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={copyLink}
        className={cn(
          "transition-all duration-200",
          copied 
            ? "text-green-600 border-green-300 bg-green-50" 
            : "hover:border-gray-400"
        )}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Copiado!
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4 mr-2" />
            Copiar Link
          </>
        )}
      </Button>
    </div>
  );
}