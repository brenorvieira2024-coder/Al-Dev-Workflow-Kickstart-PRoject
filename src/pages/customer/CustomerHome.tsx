import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StoreCard } from '@/components/StoreCard';
import { ChatButton } from '@/components/ChatButton';
import { mockEstabelecimentos } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CustomerHome() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { getTotalItems } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStores = mockEstabelecimentos.filter(store =>
    store.nome_estabelecimento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStoreClick = (storeId: string) => {
    navigate(`/customer/store/${storeId}`);
  };

  const handleChatClick = () => {
    // Open chat functionality would be implemented here
    console.log('Opening chat...');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-brand-blue">E-Commerce</h1>
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
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Encontre sua loja favorita</h2>
          <p className="text-muted-foreground mb-6">
            Descubra os melhores estabelecimentos da sua região
          </p>
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar lojas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Featured Stores */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold">Lojas em Destaque</h3>
            <span className="text-muted-foreground">
              {filteredStores.length} lojas encontradas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onClick={() => handleStoreClick(store.id)}
              />
            ))}
          </div>

          {filteredStores.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">Nenhuma loja encontrada</h3>
                <p className="text-muted-foreground">
                  Tente buscar com outros termos ou verifique se digitou corretamente.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Quick Stats */}
        <section className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-brand-orange">
                  {mockEstabelecimentos.length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Lojas disponíveis</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-brand-blue">
                  1000+
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Produtos cadastrados</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-success">
                  24h
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Entrega rápida</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Floating Chat Button */}
      <ChatButton onClick={handleChatClick} />
    </div>
  );
}