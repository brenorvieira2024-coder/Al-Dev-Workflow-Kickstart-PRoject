import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Store } from 'lucide-react';

export default function VendorLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    login('vendedor', 'EST_001');
    toast({
      title: "Login realizado com sucesso!",
      description: "Bem-vindo ao painel do vendedor!",
    });
    
    navigate('/vendor/dashboard');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Store className="h-12 w-12 text-brand-blue" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Painel do Vendedor</h1>
          <p className="text-muted-foreground mt-2">Gerencie sua loja e produtos</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acesso do Vendedor</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o painel de gestão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email do estabelecimento</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="contato@meuestablecimento.com"
                  defaultValue="contato@mercadocentral.com"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Sua senha"
                  defaultValue="senhaSegura123"
                  required 
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                variant="default"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Acessar Painel"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button 
            variant="link" 
            onClick={() => navigate('/')}
            className="text-brand-blue"
          >
            É cliente? Clique aqui para fazer pedidos
          </Button>
        </div>
      </div>
    </div>
  );
}