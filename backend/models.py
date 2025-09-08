from datetime import datetime
from sqlalchemy import CheckConstraint
from werkzeug.security import generate_password_hash, check_password_hash

from .database import db


class Vendedor(db.Model):
	"""Represents a seller account which owns one or more establishments."""

	__tablename__ = "vendedores"

	id = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String(120), unique=True, nullable=False, index=True)
	senha_hash = db.Column(db.String(256), nullable=False)

	estabelecimentos = db.relationship(
		"Estabelecimento",
		backref="vendedor",
		lazy=True,
		cascade="all, delete-orphan",
	)

	def set_password(self, password: str) -> None:
		"""Hash and set the password for the seller."""
		self.senha_hash = generate_password_hash(password)

	def check_password(self, password: str) -> bool:
		"""Validate a password against the stored hash."""
		return check_password_hash(self.senha_hash, password)


class Cliente(db.Model):
	"""Represents an end customer who can place orders and manage addresses."""

	__tablename__ = "clientes"

	id = db.Column(db.Integer, primary_key=True)
	nome = db.Column(db.String(120), nullable=False)
	email = db.Column(db.String(120), unique=True, nullable=False, index=True)
	contato = db.Column(db.String(50), nullable=True)
	senha_hash = db.Column(db.String(256), nullable=False)

	enderecos = db.relationship(
		"EnderecoCliente",
		backref="cliente",
		lazy=True,
		cascade="all, delete-orphan",
	)
	pedidos = db.relationship("Pedido", backref="cliente", lazy=True)

	def set_password(self, password: str) -> None:
		self.senha_hash = generate_password_hash(password)

	def check_password(self, password: str) -> bool:
		return check_password_hash(self.senha_hash, password)


class Estabelecimento(db.Model):
	"""Store/establishment owned by a seller that lists products and receives orders."""

	__tablename__ = "estabelecimentos"

	id = db.Column(db.Integer, primary_key=True)
	nome = db.Column(db.String(120), nullable=False)
	endereco_json = db.Column(db.JSON, nullable=True)
	vendedor_id = db.Column(db.Integer, db.ForeignKey("vendedores.id"), nullable=False)

	produtos = db.relationship(
		"Produto",
		backref="estabelecimento",
		lazy=True,
		cascade="all, delete-orphan",
	)
	pedidos = db.relationship("Pedido", backref="estabelecimento", lazy=True)


class Produto(db.Model):
	"""Product available for sale within an establishment."""

	__tablename__ = "produtos"

	id = db.Column(db.Integer, primary_key=True)
	nome = db.Column(db.String(120), nullable=False)
	descricao = db.Column(db.Text, nullable=True)
	preco = db.Column(db.Float, nullable=False)
	disponibilidade = db.Column(db.Boolean, default=True, nullable=False)
	quantidade_estoque = db.Column(db.Integer, nullable=False, default=0)
	estabelecimento_id = db.Column(
		db.Integer, db.ForeignKey("estabelecimentos.id"), nullable=False
	)

	__table_args__ = (
		CheckConstraint("preco >= 0", name="ck_produto_preco_non_negative"),
		CheckConstraint(
			"quantidade_estoque >= 0", name="ck_produto_quantidade_non_negative"
		),
	)


class EnderecoCliente(db.Model):
	"""Delivery address for a customer."""

	__tablename__ = "enderecos_cliente"

	id = db.Column(db.Integer, primary_key=True)
	rua = db.Column(db.String(120), nullable=False)
	numero = db.Column(db.String(20), nullable=False)
	bairro = db.Column(db.String(120), nullable=False)
	cidade = db.Column(db.String(120), nullable=False)
	estado = db.Column(db.String(2), nullable=False)
	cep = db.Column(db.String(20), nullable=False)
	complemento = db.Column(db.String(120), nullable=True)
	cliente_id = db.Column(db.Integer, db.ForeignKey("clientes.id"), nullable=False)


class Pedido(db.Model):
	"""Order placed by a customer at one establishment with a set of items."""

	__tablename__ = "pedidos"

	id = db.Column(db.Integer, primary_key=True)
	estabelecimento_id = db.Column(
		db.Integer, db.ForeignKey("estabelecimentos.id"), nullable=False
	)
	cliente_id = db.Column(db.Integer, db.ForeignKey("clientes.id"), nullable=False)
	endereco_entrega_id = db.Column(
		db.Integer, db.ForeignKey("enderecos_cliente.id"), nullable=False
	)
	forma_pagamento = db.Column(db.String(50), nullable=False)
	itens = db.Column(db.JSON, nullable=False)
	total = db.Column(db.Float, nullable=False)
	criado_em = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

	endereco_entrega = db.relationship("EnderecoCliente")