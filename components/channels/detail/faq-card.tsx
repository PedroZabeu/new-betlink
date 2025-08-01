'use client';

import { FAQ } from '@/lib/types/channel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FaqCardProps {
  faqs: FAQ[];
}

export default function FaqCard({ faqs }: FaqCardProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  
  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perguntas Frequentes</CardTitle>
        <CardDescription>
          Tire suas dúvidas sobre o canal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {faqs.map((faq) => {
            const isOpen = openItems.includes(faq.id);
            
            return (
              <Collapsible
                key={faq.id}
                open={isOpen}
                onOpenChange={() => toggleItem(faq.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
                    <span className="text-sm font-medium pr-2">{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform shrink-0",
                        isOpen && "rotate-180"
                      )}
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-3 pb-3 pt-1">
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}