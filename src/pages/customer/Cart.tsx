import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b shadow-soft">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/customer/home')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">Carrinho de Compras</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <Card className="text-center py-12 max-w-md mx-auto">
            <CardContent>
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Carrinho vazio</h2>
              <p className="text-muted-foreground mb-6">
                Adicione produtos ao seu carrinho para continuar
              </p>
              <Button 
                variant="primary"
                onClick={() => navigate('/customer/home')}
              >
                Continuar Comprando
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold">Carrinho de Compras</h1>
            </div>
            <Button 
              variant="outline"
              onClick={clearCart}
              className="text-destructive hover:text-destructive"
            >
              Limpar Carrinho
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              Seus itens ({items.length} produtos)
            </h2>
            
            {items.map((item) => (
              <Card key={item.id_produto} className="shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src="/api/placeholder/200/200"
                          alt={item.nome_produto}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.nome_produto}</h3>
                        <p className="text-lg font-bold text-foreground">
                          R$ {item.preco.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantidade_estoque} disponíveis
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id_produto, item.quantidade - 1)}
                          disabled={item.quantidade <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantidade}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id_produto, item.quantidade + 1)}
                          disabled={item.quantidade >= item.quantidade_estoque}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-[100px]">
                        <p className="font-semibold">
                          R$ {(item.preco * item.quantidade).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id_produto)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-soft sticky top-8">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de entrega</span>
                    <span className="text-success">Grátis</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>R$ {getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  className="w-full"
                  size="lg"
                  onClick={() => navigate('/customer/checkout')}
                >
                  Finalizar Compra
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/customer/home')}
                >
                  Continuar Comprando
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}