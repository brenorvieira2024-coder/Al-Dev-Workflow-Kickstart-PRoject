// E-commerce Platform Types

export interface Address {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Estabelecimento {
  id: string;
  nome_estabelecimento: string;
  endereco: Address;
  email_login: string;
  banner_url?: string;
  promocoes?: string[];
}

export interface Product {
  id_produto: string;
  nome_produto: string;
  descricao?: string;
  preco: number;
  preco_venda?: number;
  disponibilidade: 'em_estoque' | 'esgotado';
  quantidade_estoque: number;
  status_disponibilidade?: 'em_estoque' | 'esgotado';
  imagem_url?: string;
}

export interface CartItem {
  id_produto: string;
  nome_produto: string;
  preco: number;
  quantidade: number;
  quantidade_estoque: number;
}

export interface Order {
  id: string;
  id_estabelecimento: string;
  id_cliente: string;
  id_endereco_entrega: string;
  forma_pagamento: 'cartao_credito' | 'cartao_debito' | 'pix' | 'dinheiro';
  itens_pedido: OrderItem[];
  total: number;
  status: 'pendente' | 'confirmado' | 'entregue' | 'cancelado';
  data_pedido: string;
}

export interface OrderItem {
  id_produto: string;
  quantidade: number;
  preco_unitario?: number;
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  enderecos: Address[];
}

export interface SalesData {
  total_vendas: number;
  quantidade_pedidos: number;
  periodo_relatorio: string;
  produtos_vendidos: {
    id_produto: string;
    nome_produto: string;
    quantidade_vendida: number;
    total_arrecadado: number;
  }[];
}

export interface ChatMessage {
  id: string;
  id_cliente: string;
  id_estabelecimento: string;
  mensagem: string;
  timestamp: string;
  remetente: 'cliente' | 'vendedor';
}

export type UserRole = 'cliente' | 'vendedor';