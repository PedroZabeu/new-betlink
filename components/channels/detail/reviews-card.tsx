import { Review } from '@/lib/types/channel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReviewsCardProps {
  reviews: Review[];
  rating: number;
}

export default function ReviewsCard({ reviews, rating }: ReviewsCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'fill-yellow-500 text-yellow-500'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliações</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(Math.round(rating))}</div>
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviews.length} avaliações)</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={review.id}>
              {index > 0 && <Separator className="mb-4" />}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{review.author}</p>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {format(new Date(review.date), "d 'de' MMM", { locale: ptBR })}
                  </time>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}