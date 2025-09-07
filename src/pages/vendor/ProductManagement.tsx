import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockProducts } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  Package,
  DollarSign
} from 'lucide-react';
import { Product } from '@/types';

export default function ProductManagement() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [products, setProducts] = useState(userId ? mockProducts[userId] || [] : []);

  const [newProduct, setNewProduct] = useState({
    nome_produto: '',
    descricao: '',
    preco: '',
    quantidade_estoque: ''
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    const product: Product = {
      id_produto: `PROD_${Date.now()}`,
      nome_produto: newProduct.nome_produto,
      descricao: newProduct.descricao,
      preco: parseFloat(newProduct.preco),
      preco_venda: parseFloat(newProduct.preco),
      quantidade_estoque: parseInt(newProduct.quantidade_estoque),
      disponibilidade: parseInt(newProduct.quantidade_estoque) > 0 ? 'em_estoque' : 'esgotado',
      status_disponibilidade: parseInt(newProduct.quantidade_estoque) > 0 ? 'em_estoque' : 'esgotado',
      imagem_url: "/api/placeholder/200/200"
    };

    setProducts(prev => [...prev, product]);
    setNewProduct({ nome_produto: '', descricao: '', preco: '', quantidade_estoque: '' });
    setIsAddModalOpen(false);
    
    toast({
      title: "Produto adicionado!",
      description: `${product.nome_produto} foi adicionado com sucesso.`,
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id_produto !== productId));
    toast({
      title: "Produto removido",
      description: "O produto foi removido da sua loja.",
    });
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
                onClick={() => navigate('/vendor/dashboard')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-brand-blue">Gerenciar Produtos</h1>
                <p className="text-muted-foreground">
                  Adicione, edite e remova produtos da sua loja
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats and Add Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-brand-blue" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">Em Estoque</p>
                    <p className="text-2xl font-bold">
                      {products.filter(p => p.disponibilidade === 'em_estoque').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-brand-orange" />
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="text-2xl font-bold">
                      R$ {products.reduce((sum, p) => sum + (p.preco * p.quantidade_estoque), 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button variant="primary" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Produto</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do produto</Label>
                  <Input
                    id="nome"
                    value={newProduct.nome_produto}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, nome_produto: e.target.value }))}
                    placeholder="Ex: Arroz Integral 5kg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={newProduct.descricao}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descrição do produto..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preco">Preço (R$)</Label>
                    <Input
                      id="preco"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newProduct.preco}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, preco: e.target.value }))}
                      placeholder="25.99"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estoque">Estoque</Label>
                    <Input
                      id="estoque"
                      type="number"
                      min="0"
                      value={newProduct.quantidade_estoque}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, quantidade_estoque: e.target.value }))}
                      placeholder="50"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary">
                    Adicionar Produto
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {products.length > 0 ? (
            products.map((product) => (
              <Card key={product.id_produto} className="shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={product.imagem_url || "/api/placeholder/200/200"}
                          alt={product.nome_produto}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{product.nome_produto}</h3>
                        <p className="text-muted-foreground text-sm">{product.descricao}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <p className="text-lg font-bold text-foreground">
                            R$ {product.preco.toFixed(2)}
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
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id_produto)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum produto cadastrado</h3>
                <p className="text-muted-foreground mb-4">
                  Comece adicionando seus primeiros produtos à loja.
                </p>
                <Button 
                  variant="primary"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Produto
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}