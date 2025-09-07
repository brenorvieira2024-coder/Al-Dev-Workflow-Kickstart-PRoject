import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatButton } from '@/components/ChatButton';
import { mockSalesData, mockEstabelecimentos } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  LogOut, 
  Settings,
  Plus
} from 'lucide-react';

export default function VendorDashboard() {
  const navigate = useNavigate();
  const { logout, userId } = useAuth();
  
  const currentStore = mockEstabelecimentos.find(store => store.id === userId);
  const salesData = mockSalesData;

  const handleLogout = () => {
    logout();
    navigate('/vendor/login');
  };

  const handleChatClick = () => {
    console.log('Opening chat for vendor...');
  };

  const navigationItems = [
    {
      title: 'Produtos',
      description: 'Gerenciar produtos da loja',
      action: () => navigate('/vendor/products'),
      icon: Package,
      color: 'text-brand-blue'
    },
    {
      title: 'Pedidos',
      description: 'Visualizar e gerenciar pedidos',
      action: () => console.log('Navigate to orders'),
      icon: ShoppingCart,
      color: 'text-brand-orange'
    },
    {
      title: 'Configurações',
      description: 'Configurações da loja',
      action: () => console.log('Navigate to settings'),
      icon: Settings,
      color: 'text-muted-foreground'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-brand-blue">Painel do Vendedor</h1>
              <p className="text-muted-foreground">
                {currentStore?.nome_estabelecimento || 'Sua Loja'}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Bem-vindo, {currentStore?.nome_estabelecimento}!
          </h2>
          <p className="text-muted-foreground">
            Aqui está um resumo das suas vendas e atividades recentes.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
              <DollarSign className="h-4 w-4 text-brand-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {salesData.total_vendas.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {salesData.periodo_relatorio}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-brand-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesData.quantidade_pedidos}</div>
              <p className="text-xs text-muted-foreground">
                Pedidos realizados
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Vendidos</CardTitle>
              <Package className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {salesData.produtos_vendidos.reduce((sum, product) => sum + product.quantidade_vendida, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Unidades vendidas
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12%</div>
              <p className="text-xs text-muted-foreground">
                vs. mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {navigationItems.map((item, index) => (
            <Card 
              key={index}
              className="shadow-soft transition-smooth hover:shadow-medium cursor-pointer"
              onClick={item.action}
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Top Products */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Produtos Mais Vendidos
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => navigate('/vendor/products')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.produtos_vendidos.map((product, index) => (
                <div key={product.id_produto} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{product.nome_produto}</h4>
                    <p className="text-sm text-muted-foreground">
                      {product.quantidade_vendida} unidades vendidas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">
                      R$ {product.total_arrecadado.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Faturamento
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Floating Chat Button */}
      <ChatButton onClick={handleChatClick} />
    </div>
  );
}