import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChatButton } from '@/components/ChatButton';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Product, Estabelecimento } from '@/types';
import { ArrowLeft, ShoppingCart, Plus, Minus, MapPin } from 'lucide-react';

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem, getTotalItems } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  // Get product and store data from location state
  const product = location.state?.product as Product;
  const store = location.state?.store as Estabelecimento;

  if (!product || !store) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
            <p className="text-muted-foreground mb-4">
              O produto que você está procurando não foi encontrado.
            </p>
            <Button onClick={() => navigate('/customer/home')}>
              Voltar para o início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.disponibilidade === 'esgotado') return;
    
    addItem({
      id_produto: product.id_produto,
      nome_produto: product.nome_produto,
      preco: product.preco_venda || product.preco,
      quantidade_estoque: product.quantidade_estoque,
      quantidade: quantity
    });

    toast({
      title: "Produto adicionado!",
      description: `${quantity}x ${product.nome_produto} adicionado ao carrinho`,
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.quantidade_estoque) {
      setQuantity(newQuantity);
    }
  };

  const handleChatClick = () => {
    console.log('Opening chat with store:', store.nome_estabelecimento);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold">Detalhes do Produto</h1>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/customer/cart')}
              className="relative"
            >
              <ShoppingCart className="h-4 w-4" />
              {getTotalItems() > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-brand-orange text-brand-orange-foreground"
                >
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img 
                src={product.imagem_url || "/api/placeholder/400/400"}
                alt={product.nome_produto}
                className="h-full w-full object-cover"
              />
            </div>
            
            {/* Store Info */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Vendido por</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{store.nome_estabelecimento}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-3 w-3" />
                      {store.endereco.bairro}, {store.endereco.cidade}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/customer/store/${store.id}`)}
                  >
                    Ver Loja
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.nome_produto}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <p className="text-4xl font-bold text-foreground">
                  R$ {(product.preco_venda || product.preco).toFixed(2)}
                </p>
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

              {product.descricao && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Descrição</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.descricao}
                  </p>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            {product.disponibilidade === 'em_estoque' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.quantidade_estoque}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-20 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.quantidade_estoque}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Máximo disponível: {product.quantidade_estoque} unidades
                  </p>
                </div>

                <Button 
                  variant="primary" 
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Adicionar ao Carrinho
                </Button>

                <div className="text-center">
                  <p className="text-lg font-semibold">
                    Total: R$ {((product.preco_venda || product.preco) * quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {product.disponibilidade === 'esgotado' && (
              <div className="text-center py-8">
                <p className="text-lg font-semibold text-destructive mb-2">
                  Produto esgotado
                </p>
                <p className="text-muted-foreground">
                  Este produto não está disponível no momento.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      <ChatButton onClick={handleChatClick} />
    </div>
  );
}