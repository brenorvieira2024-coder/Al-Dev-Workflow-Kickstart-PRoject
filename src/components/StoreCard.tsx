import { Estabelecimento } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface StoreCardProps {
  store: Estabelecimento;
  onClick: () => void;
}

export function StoreCard({ store, onClick }: StoreCardProps) {
  return (
    <Card 
      className="shadow-soft transition-smooth hover:shadow-medium cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="aspect-video mb-3 overflow-hidden rounded-lg bg-gray-100">
          <img 
            src={store.banner_url || "/api/placeholder/400/200"}
            alt={`Banner ${store.nome_estabelecimento}`}
            className="h-full w-full object-cover"
          />
        </div>
        <CardTitle className="text-lg">{store.nome_estabelecimento}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          {store.endereco.bairro}, {store.endereco.cidade}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {store.promocoes && store.promocoes.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Promoções:</p>
            <div className="space-y-1">
              {store.promocoes.slice(0, 2).map((promocao, index) => (
                <Badge key={index} variant="outline" className="text-xs block w-fit">
                  {promocao}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}