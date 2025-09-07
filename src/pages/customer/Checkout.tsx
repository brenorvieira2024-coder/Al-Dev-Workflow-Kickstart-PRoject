import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mockCliente } from '@/data/mockData';
import { ArrowLeft, CreditCard, MapPin, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { userId } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const cliente = mockCliente; // In real app, fetch based on userId

  if (items.length === 0) {
    navigate('/customer/cart');
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !paymentMethod) {
      toast({
        title: "Informações incompletas",
        description: "Selecione um endereço e forma de pagamento",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearCart();
    setCurrentStep(4);
    setIsLoading(false);
    
    toast({
      title: "Pedido realizado com sucesso!",
      description: "Você receberá uma confirmação por email.",
    });
  };

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center p-8 max-w-md mx-auto">
          <CardContent>
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Pedido Confirmado!</h2>
            <p className="text-muted-foreground mb-6">
              Seu pedido foi realizado com sucesso. Você receberá uma confirmação por email.
            </p>
            <div className="space-y-2">
              <Button 
                variant="primary"
                className="w-full"
                onClick={() => navigate('/customer/home')}
              >
                Continuar Comprando
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => console.log('View orders')}
              >
                Ver Meus Pedidos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/customer/cart')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Finalizar Compra</h1>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-card/50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: 'Entrega' },
              { step: 2, title: 'Pagamento' },
              { step: 3, title: 'Confirmação' }
            ].map((item) => (
              <div key={item.step} className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= item.step 
                    ? 'bg-brand-orange text-brand-orange-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {item.step}
                </div>
                <span className={currentStep >= item.step ? 'text-foreground' : 'text-muted-foreground'}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Delivery Address */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                  {cliente.enderecos.map((endereco, index) => (
                    <div key={index} className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value={index.toString()} id={`address-${index}`} />
                      <Label htmlFor={`address-${index}`} className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">
                            {endereco.rua}, {endereco.numero}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {endereco.bairro}, {endereco.cidade} - {endereco.estado}, {endereco.cep}
                          </p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {selectedAddress && (
                  <Button 
                    className="mt-4"
                    onClick={() => setCurrentStep(2)}
                  >
                    Continuar para Pagamento
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Payment Method */}
            {currentStep >= 2 && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Forma de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    {[
                      { id: 'cartao_credito', label: 'Cartão de Crédito', description: 'Visa, Mastercard, Elo' },
                      { id: 'cartao_debito', label: 'Cartão de Débito', description: 'Débito à vista' },
                      { id: 'pix', label: 'PIX', description: 'Pagamento instantâneo' },
                      { id: 'dinheiro', label: 'Dinheiro', description: 'Pagamento na entrega' }
                    ].map((method) => (
                      <div key={method.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">{method.label}</p>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  {paymentMethod && (
                    <Button 
                      className="mt-4"
                      onClick={() => setCurrentStep(3)}
                    >
                      Revisar Pedido
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Order Review */}
            {currentStep >= 3 && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Revisar Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Itens do Pedido</h4>
                    {items.map((item) => (
                      <div key={item.id_produto} className="flex justify-between py-2">
                        <span>{item.quantidade}x {item.nome_produto}</span>
                        <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Endereço de Entrega</h4>
                    {selectedAddress && (
                      <div className="text-sm text-muted-foreground">
                        {(() => {
                          const endereco = cliente.enderecos[parseInt(selectedAddress)];
                          return `${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}`;
                        })()}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Forma de Pagamento</h4>
                    <p className="text-sm text-muted-foreground">
                      {paymentMethod === 'cartao_credito' && 'Cartão de Crédito'}
                      {paymentMethod === 'cartao_debito' && 'Cartão de Débito'}
                      {paymentMethod === 'pix' && 'PIX'}
                      {paymentMethod === 'dinheiro' && 'Dinheiro'}
                    </p>
                  </div>

                  <Button 
                    variant="primary" 
                    className="w-full mt-6"
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processando..." : "Finalizar Compra"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-soft sticky top-8">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id_produto} className="flex justify-between text-sm">
                      <span>{item.quantidade}x {item.nome_produto}</span>
                      <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
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
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}