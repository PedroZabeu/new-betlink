import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Lightbulb, Target, Clock } from 'lucide-react';

interface AboutCardProps {
  about: {
    bio: string;
    methodology: string;
    specialties: string[];
    experience: string;
  };
  tipster: string;
}

export default function AboutCard({ about, tipster }: AboutCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sobre o Tipster</CardTitle>
        <CardDescription>{tipster}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Biografia</p>
              <p className="text-sm text-muted-foreground">{about.bio}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Metodologia</p>
              <p className="text-sm text-muted-foreground">{about.methodology}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Especialidades</p>
              <div className="flex gap-1 flex-wrap">
                {about.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Experiência</p>
              <p className="text-sm text-muted-foreground">{about.experience}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}