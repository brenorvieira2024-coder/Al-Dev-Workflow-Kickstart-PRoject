import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Store } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="p-4 bg-gradient-to-r from-brand-orange/20 to-brand-blue/20 rounded-full">
              <ShoppingBag className="h-16 w-16 text-brand-blue" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-brand-blue to-brand-orange bg-clip-text text-transparent">
            Sua Plataforma de E-commerce
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Conectando vendedores e clientes em uma experiência de compra única. 
            Descubra produtos incríveis ou gerencie sua loja com facilidade.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Customer Card */}
            <Card className="shadow-soft transition-smooth hover:shadow-medium cursor-pointer" onClick={() => navigate('/customer/login')}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-brand-orange/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-brand-orange" />
                </div>
                <CardTitle className="text-2xl">Sou Cliente</CardTitle>
                <CardDescription className="text-base">
                  Faça pedidos e encontre os melhores produtos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="primary" className="w-full">
                  Começar a Comprar
                </Button>
              </CardContent>
            </Card>

            {/* Vendor Card */}
            <Card className="shadow-soft transition-smooth hover:shadow-medium cursor-pointer" onClick={() => navigate('/vendor/login')}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-brand-blue/10 rounded-full flex items-center justify-center">
                  <Store className="h-8 w-8 text-brand-blue" />
                </div>
                <CardTitle className="text-2xl">Sou Vendedor</CardTitle>
                <CardDescription className="text-base">
                  Gerencie sua loja e vendas online
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="default" className="w-full">
                  Acessar Painel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher nossa plataforma?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-brand-orange/10 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-brand-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fácil de Usar</h3>
              <p className="text-muted-foreground">
                Interface intuitiva e simples para clientes e vendedores
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-brand-blue/10 rounded-full flex items-center justify-center">
                <Store className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão Completa</h3>
              <p className="text-muted-foreground">
                Ferramentas completas para gerenciar produtos e vendas
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-success/10 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-muted-foreground">
                Sistema otimizado para entregas rápidas e eficientes
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
