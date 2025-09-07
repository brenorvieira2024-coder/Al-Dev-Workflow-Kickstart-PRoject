import { Estabelecimento, Product, SalesData, Cliente } from '@/types';

// Mock Establishments
export const mockEstabelecimentos: Estabelecimento[] = [
  {
    id: "EST_001",
    nome_estabelecimento: "Mercado Central",
    endereco: {
      rua: "Avenida Brasil",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000"
    },
    email_login: "contato@mercadocentral.com",
    banner_url: "/api/placeholder/800/300",
    promocoes: [
      "20% de desconto em produtos de limpeza",
      "Frete grátis para compras acima de R$ 50",
      "Promoção especial: Leve 3, pague 2 em bebidas"
    ]
  },
  {
    id: "EST_002", 
    nome_estabelecimento: "Padaria do Bairro",
    endereco: {
      rua: "Rua das Flores",
      numero: "456",
      bairro: "Vila Nova",
      cidade: "São Paulo",
      estado: "SP",
      cep: "02000-000"
    },
    email_login: "contato@padariadobairro.com",
    banner_url: "/api/placeholder/800/300",
    promocoes: [
      "Pão francês fresquinho todo dia",
      "Combo café + pão de açúcar por R$ 8,50"
    ]
  },
  {
    id: "EST_003",
    nome_estabelecimento: "Farmácia Vida",
    endereco: {
      rua: "Rua da Saúde",
      numero: "789",
      bairro: "Centro",
      cidade: "São Paulo", 
      estado: "SP",
      cep: "03000-000"
    },
    email_login: "contato@farmaciavida.com",
    banner_url: "/api/placeholder/800/300",
    promocoes: [
      "Desconto de 15% em medicamentos genéricos",
      "Delivery grátis para pedidos acima de R$ 30"
    ]
  }
];

// Mock Products
export const mockProducts: Record<string, Product[]> = {
  EST_001: [
    {
      id_produto: "PROD_ABC123",
      nome_produto: "Leite Integral 1L",
      descricao: "Leite integral de alta qualidade",
      preco: 4.50,
      preco_venda: 4.50,
      quantidade_estoque: 25,
      disponibilidade: "em_estoque",
      status_disponibilidade: "em_estoque",
      imagem_url: "/api/placeholder/200/200"
    },
    {
      id_produto: "PROD_XYZ456",
      nome_produto: "Pão de Forma Tradicional",
      descricao: "Pão de forma macio e nutritivo",
      preco: 7.90,
      preco_venda: 7.90,
      quantidade_estoque: 0,
      disponibilidade: "esgotado",
      status_disponibilidade: "esgotado",
      imagem_url: "/api/placeholder/200/200"
    },
    {
      id_produto: "PROD_DEF789",
      nome_produto: "Arroz Integral 5kg",
      descricao: "Arroz de alta qualidade, 100% integral",
      preco: 25.99,
      preco_venda: 25.99,
      quantidade_estoque: 50,
      disponibilidade: "em_estoque",
      status_disponibilidade: "em_estoque",
      imagem_url: "/api/placeholder/200/200"
    },
    {
      id_produto: "PROD_GHI012",
      nome_produto: "Sabão em Pó 2kg",
      descricao: "Sabão em pó concentrado para roupas",
      preco: 18.50,
      preco_venda: 18.50,
      quantidade_estoque: 30,
      disponibilidade: "em_estoque",
      status_disponibilidade: "em_estoque",
      imagem_url: "/api/placeholder/200/200"
    }
  ],
  EST_002: [
    {
      id_produto: "PROD_PAN001",
      nome_produto: "Pão Francês (kg)",
      descricao: "Pão francês fresquinho",
      preco: 12.00,
      preco_venda: 12.00,
      quantidade_estoque: 100,
      disponibilidade: "em_estoque",
      status_disponibilidade: "em_estoque",
      imagem_url: "/api/placeholder/200/200"
    },
    {
      id_produto: "PROD_PAN002",
      nome_produto: "Bolo de Chocolate",
      descricao: "Bolo caseiro de chocolate",
      preco: 35.00,
      preco_venda: 35.00,
      quantidade_estoque: 5,
      disponibilidade: "em_estoque",
      status_disponibilidade: "em_estoque",
      imagem_url: "/api/placeholder/200/200"
    }
  ],
  EST_003: [
    {
      id_produto: "PROD_MED001",
      nome_produto: "Dipirona 500mg",
      descricao: "Analgésico e antitérmico",
      preco: 8.90,
      preco_venda: 8.90,
      quantidade_estoque: 20,
      disponibilidade: "em_estoque",
      status_disponibilidade: "em_estoque",
      imagem_url: "/api/placeholder/200/200"
    },
    {
      id_produto: "PROD_MED002",
      nome_produto: "Vitamina C",
      descricao: "Suplemento vitamínico",
      preco: 15.50,
      preco_venda: 15.50,
      quantidade_estoque: 0,
      disponibilidade: "esgotado",
      status_disponibilidade: "esgotado",
      imagem_url: "/api/placeholder/200/200"
    }
  ]
};

// Mock Sales Data
export const mockSalesData: SalesData = {
  total_vendas: 550.75,
  quantidade_pedidos: 12,
  periodo_relatorio: "01/08/2025 a 31/08/2025",
  produtos_vendidos: [
    {
      id_produto: "PROD_ABC123",
      nome_produto: "Leite Integral 1L",
      quantidade_vendida: 20,
      total_arrecadado: 90.00
    },
    {
      id_produto: "PROD_DEF789", 
      nome_produto: "Arroz Integral 5kg",
      quantidade_vendida: 8,
      total_arrecadado: 207.92
    },
    {
      id_produto: "PROD_GHI012",
      nome_produto: "Sabão em Pó 2kg", 
      quantidade_vendida: 15,
      total_arrecadado: 277.50
    }
  ]
};

// Mock Cliente
export const mockCliente: Cliente = {
  id: "CLI_001",
  nome: "João Silva",
  email: "joao.silva@email.com",
  telefone: "(11) 99999-9999",
  enderecos: [
    {
      rua: "Rua das Palmeiras",
      numero: "100",
      bairro: "Vila Verde",
      cidade: "São Paulo",
      estado: "SP",
      cep: "04000-000"
    },
    {
      rua: "Avenida Paulista",
      numero: "1000",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP",
      cep: "05000-000"
    }
  ]
};