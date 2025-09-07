import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  onProductClick?: (product: Product) => void;
}

export function ProductCard({ product, showAddToCart = false, onProductClick }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.disponibilidade === 'esgotado') return;
    
    addItem({
      id_produto: product.id_produto,
      nome_produto: product.nome_produto,
      preco: product.preco_venda || product.preco,
      quantidade_estoque: product.quantidade_estoque
    });

    toast({
      title: "Produto adicionado",
      description: `${product.nome_produto} foi adicionado ao carrinho`,
    });
  };

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  return (
    <Card 
      className={`shadow-soft transition-smooth hover:shadow-medium ${onProductClick ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
          <img 
            src={product.imagem_url || "/api/placeholder/200/200"}
            alt={product.nome_produto}
            className="h-full w-full object-cover"
          />
        </div>
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.nome_produto}</h3>
        <p className="text-2xl font-bold text-foreground mb-2">
          R$ {(product.preco_venda || product.preco).toFixed(2)}
        </p>
        <div className="flex items-center justify-between">
          <Badge 
            variant={product.disponibilidade === 'em_estoque' ? 'secondary' : 'destructive'}
            className={product.disponibilidade === 'em_estoque' ? 'bg-success text-success-foreground' : ''}
          >
            {product.disponibilidade === 'em_estoque' 
              ? `${product.quantidade_estoque} em estoque` 
              : 'Esgotado'
            }
          </Badge>
        </div>
      </CardContent>
      {showAddToCart && (
        <CardFooter className="p-4 pt-0">
          <Button 
            variant="primary" 
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.disponibilidade === 'esgotado'}
          >
            Adicionar ao Carrinho
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}