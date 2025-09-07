import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { ChatButton } from '@/components/ChatButton';
import { mockEstabelecimentos, mockProducts } from '@/data/mockData';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { ArrowLeft, MapPin, ShoppingCart, User } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export default function StorePage() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();

  const store = mockEstabelecimentos.find(s => s.id === storeId);
  const products = storeId ? mockProducts[storeId] || [] : [];

  if (!store) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Loja não encontrada</h2>
            <p className="text-muted-foreground mb-4">
              A loja que você está procurando não existe ou foi removida.
            </p>
            <Button onClick={() => navigate('/customer/home')}>
              Voltar para o início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleProductClick = (product: Product) => {
    navigate(`/customer/product/${product.id_produto}`, { 
      state: { product, store } 
    });
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
                onClick={() => navigate('/customer/home')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold">{store.nome_estabelecimento}</h1>
            </div>
            <div className="flex items-center gap-4">
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
              <Button variant="outline" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Store Banner */}
      <section className="bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="aspect-video md:aspect-[3/1] mb-6 overflow-hidden rounded-lg bg-gray-100">
            <img 
              src={store.banner_url || "/api/placeholder/1200/400"}
              alt={`Banner ${store.nome_estabelecimento}`}
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">{store.nome_estabelecimento}</h2>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="mr-2 h-4 w-4" />
              <span>
                {store.endereco.rua}, {store.endereco.numero} - {store.endereco.bairro}, {store.endereco.cidade}
              </span>
            </div>
          </div>

          {/* Promotions Carousel */}
          {store.promocoes && store.promocoes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Promoções Especiais</h3>
              <Carousel className="w-full">
                <CarouselContent>
                  {store.promocoes.map((promocao, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <Card className="bg-gradient-to-r from-brand-orange/10 to-brand-blue/10">
                        <CardContent className="p-6">
                          <p className="text-sm font-medium">{promocao}</p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold">Produtos Disponíveis</h3>
          <span className="text-muted-foreground">
            {products.length} produtos
          </span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id_produto}
                product={product}
                showAddToCart
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Nenhum produto disponível</h3>
              <p className="text-muted-foreground">
                Esta loja ainda não cadastrou produtos ou todos estão temporariamente indisponíveis.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Floating Chat Button */}
      <ChatButton onClick={handleChatClick} />
    </div>
  );
}