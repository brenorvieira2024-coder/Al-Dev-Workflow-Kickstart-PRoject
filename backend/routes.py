from datetime import datetime, timedelta
from typing import Any, Dict, List

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
	JWTManager,
	create_access_token,
	get_jwt_identity,
	jwt_required,
)

from .database import db
from .models import (
	Cliente,
	EnderecoCliente,
	Estabelecimento,
	Pedido,
	Produto,
	Vendedor,
)
from .gemini_service import ask_gemini


api_bp = Blueprint("api", __name__)


# -----------------------------
# Helpers
# -----------------------------

def _json_error(message: str, status: int):
	return jsonify({"error": message}), status


def _get_identity() -> Dict[str, Any] | None:
	ident = get_jwt_identity()
	if not isinstance(ident, dict):
		return None
	return ident


def _require_role(expected_role: str):
	ident = _get_identity()
	if not ident or ident.get("role") != expected_role:
		return None, _json_error("Unauthorized", 401)
	return ident.get("id"), None


# -----------------------------
# Auth Endpoints
# -----------------------------
@api_bp.post("/vendedor/cadastro")
def vendedor_cadastro():
	"""Register a new seller and their establishment."""
	data = request.get_json(silent=True) or {}
	email = data.get("email")
	senha = data.get("senha")
	estabelecimento_nome = data.get("estabelecimento_nome")
	endereco = data.get("endereco")  # dict optional
	if not all([email, senha, estabelecimento_nome]):
		return _json_error("Campos obrigatórios: email, senha, estabelecimento_nome", 400)

	if Vendedor.query.filter_by(email=email).first():
		return _json_error("E-mail já cadastrado", 409)

	vendedor = Vendedor(email=email)
	vendedor.set_password(senha)
	db.session.add(vendedor)
	db.session.flush()

	estab = Estabelecimento(
		nome=estabelecimento_nome,
		endereco_json=endereco if isinstance(endereco, dict) else None,
		vendedor_id=vendedor.id,
	)
	db.session.add(estab)
	db.session.commit()

	return (
		jsonify(
			{
				"vendedor_id": vendedor.id,
				"estabelecimento_id": estab.id,
			}
		),
		201,
	)


@api_bp.post("/vendedor/login")
def vendedor_login():
	"""Authenticate a seller and return a JWT token."""
	data = request.get_json(silent=True) or {}
	email = data.get("email")
	senha = data.get("senha")
	if not all([email, senha]):
		return _json_error("Campos obrigatórios: email, senha", 400)

	user = Vendedor.query.filter_by(email=email).first()
	if not user or not user.check_password(senha):
		return _json_error("Credenciais inválidas", 401)

	token = create_access_token(identity={"role": "vendedor", "id": user.id})
	return jsonify({"access_token": token}), 200


@api_bp.post("/cliente/cadastro")
def cliente_cadastro():
	"""Register a new customer."""
	data = request.get_json(silent=True) or {}
	nome = data.get("nome")
	email = data.get("email")
	contato = data.get("contato")
	senha = data.get("senha")
	if not all([nome, email, senha]):
		return _json_error("Campos obrigatórios: nome, email, senha", 400)

	if Cliente.query.filter_by(email=email).first():
		return _json_error("E-mail já cadastrado", 409)

	cliente = Cliente(nome=nome, email=email, contato=contato)
	cliente.set_password(senha)
	db.session.add(cliente)
	db.session.commit()
	return jsonify({"cliente_id": cliente.id}), 201


@api_bp.post("/cliente/login")
def cliente_login():
	"""Authenticate a customer and return a JWT token."""
	data = request.get_json(silent=True) or {}
	email = data.get("email")
	senha = data.get("senha")
	if not all([email, senha]):
		return _json_error("Campos obrigatórios: email, senha", 400)

	user = Cliente.query.filter_by(email=email).first()
	if not user or not user.check_password(senha):
		return _json_error("Credenciais inválidas", 401)

	token = create_access_token(identity={"role": "cliente", "id": user.id})
	return jsonify({"access_token": token}), 200


# -----------------------------
# Vendedor - Produtos e Relatórios (JWT vendedor)
# -----------------------------
@api_bp.post("/produtos")
@jwt_required()
def criar_produto():
	"""Create a new product for a seller's establishment."""
	vendedor_id, err = _require_role("vendedor")
	if err:
		return err

	data = request.get_json(silent=True) or {}
	id_estabelecimento = data.get("id_estabelecimento")
	nome = data.get("nome")
	preco = data.get("preco")
	disponibilidade = bool(data.get("disponibilidade", True))
	quantidade_estoque = int(data.get("quantidade_estoque", 0))

	if not all([id_estabelecimento, nome, preco is not None]):
		return _json_error("Campos obrigatórios: id_estabelecimento, nome, preco", 400)

	estab = Estabelecimento.query.filter_by(
		id=id_estabelecimento, vendedor_id=vendedor_id
	).first()
	if not estab:
		return _json_error("Estabelecimento não encontrado", 404)

	produto = Produto(
		nome=nome,
		descricao=data.get("descricao"),
		preco=float(preco),
		disponibilidade=disponibilidade,
		quantidade_estoque=quantidade_estoque,
		estabelecimento_id=estab.id,
	)
	db.session.add(produto)
	db.session.commit()
	return jsonify({"id": produto.id}), 201


@api_bp.put("/produtos/<int:id_produto>")
@jwt_required()
def editar_produto(id_produto: int):
	"""Edit an existing product if it belongs to the seller."""
	vendedor_id, err = _require_role("vendedor")
	if err:
		return err

	produto = (
		Produto.query.join(Estabelecimento)
		.filter(Produto.id == id_produto, Estabelecimento.vendedor_id == vendedor_id)
		.first()
	)
	if not produto:
		return _json_error("Produto não encontrado", 404)

	data = request.get_json(silent=True) or {}
	for field in ["nome", "descricao", "preco", "disponibilidade", "quantidade_estoque"]:
		if field in data:
			setattr(produto, field, data[field])

	db.session.commit()
	return jsonify({"id": produto.id}), 200


@api_bp.delete("/produtos/<int:id_produto>")
@jwt_required()
def excluir_produto(id_produto: int):
	"""Delete a product owned by the seller."""
	vendedor_id, err = _require_role("vendedor")
	if err:
		return err

	produto = (
		Produto.query.join(Estabelecimento)
		.filter(Produto.id == id_produto, Estabelecimento.vendedor_id == vendedor_id)
		.first()
	)
	if not produto:
		return _json_error("Produto não encontrado", 404)

	db.session.delete(produto)
	db.session.commit()
	return jsonify({"deleted": True}), 200


@api_bp.get("/produtos/estabelecimento/<int:id_estabelecimento>")
@jwt_required()
def listar_produtos_estabelecimento_vendedor(id_estabelecimento: int):
	"""List all products for a seller's establishment."""
	vendedor_id, err = _require_role("vendedor")
	if err:
		return err

	estab = Estabelecimento.query.filter_by(
		id=id_estabelecimento, vendedor_id=vendedor_id
	).first()
	if not estab:
		return _json_error("Estabelecimento não encontrado", 404)

	produtos = Produto.query.filter_by(estabelecimento_id=estab.id).all()
	return jsonify([
		{
			"id": p.id,
			"nome": p.nome,
			"descricao": p.descricao,
			"preco": p.preco,
			"disponibilidade": p.disponibilidade,
			"quantidade_estoque": p.quantidade_estoque,
		}
		for p in produtos
	]), 200


@api_bp.get("/relatorios/vendas")
@jwt_required()
def relatorio_vendas():
	"""Generate a simple sales report for the seller with optional date filters."""
	vendedor_id, err = _require_role("vendedor")
	if err:
		return err

	date_start_str = request.args.get("data_inicio")
	date_end_str = request.args.get("data_fim")

	try:
		date_start = (
			datetime.fromisoformat(date_start_str) if date_start_str else datetime.min
		)
		date_end = (
			datetime.fromisoformat(date_end_str) if date_end_str else datetime.max
		)
	except ValueError:
		return _json_error("Datas inválidas. Use ISO 8601.", 400)

	estab_ids = [e.id for e in Estabelecimento.query.filter_by(vendedor_id=vendedor_id).all()]
	if not estab_ids:
		return jsonify({"total_pedidos": 0, "total_receita": 0.0}), 200

	pedidos = (
		Pedido.query.filter(
			Pedido.estabelecimento_id.in_(estab_ids),
			Pedido.criado_em >= date_start,
			Pedido.criado_em <= date_end,
		)
		.all()
	)
	total_receita = sum(p.total for p in pedidos)
	return jsonify({
		"total_pedidos": len(pedidos),
		"total_receita": total_receita,
	}), 200


# -----------------------------
# Cliente - Endereços e Pedidos (JWT cliente)
# -----------------------------
@api_bp.post("/enderecos")
@jwt_required()
def criar_endereco():
	"""Create a new address for the authenticated customer."""
	cliente_id, err = _require_role("cliente")
	if err:
		return err

	data = request.get_json(silent=True) or {}
	required = ["rua", "numero", "bairro", "cidade", "estado", "cep"]
	if not all(k in data and data[k] for k in required):
		return _json_error("Campos obrigatórios faltando no endereço", 400)

	end = EnderecoCliente(
		rua=data["rua"],
		numero=data["numero"],
		bairro=data["bairro"],
		cidade=data["cidade"],
		estado=data["estado"],
		cep=data["cep"],
		complemento=data.get("complemento"),
		cliente_id=cliente_id,
	)
	db.session.add(end)
	db.session.commit()
	return jsonify({"id": end.id}), 201


@api_bp.post("/pedidos")
@jwt_required()
def criar_pedido():
	"""Create an order, checking stock and updating inventory."""
	cliente_id, err = _require_role("cliente")
	if err:
		return err

	data = request.get_json(silent=True) or {}
	estabelecimento_id = data.get("id_estabelecimento")
	endereco_entrega_id = data.get("id_endereco_entrega")
	forma_pagamento = data.get("forma_pagamento")
	itens = data.get("itens", [])

	if not all([estabelecimento_id, endereco_entrega_id, forma_pagamento, itens]):
		return _json_error(
			"Campos obrigatórios: id_estabelecimento, id_endereco_entrega, forma_pagamento, itens",
			400,
		)

	# Validate address ownership
	end = EnderecoCliente.query.filter_by(id=endereco_entrega_id, cliente_id=cliente_id).first()
	if not end:
		return _json_error("Endereço não encontrado", 404)

	estab = Estabelecimento.query.get(estabelecimento_id)
	if not estab:
		return _json_error("Estabelecimento não encontrado", 404)

	# Validate items and compute total
	order_items: List[Dict[str, Any]] = []
	total = 0.0
	for item in itens:
		produto_id = item.get("id_produto") or item.get("produto_id")
		quantidade = int(item.get("quantidade", 0))
		if not produto_id or quantidade <= 0:
			return _json_error("Itens inválidos no pedido", 400)

		produto = Produto.query.get(produto_id)
		if not produto or produto.estabelecimento_id != estab.id or not produto.disponibilidade:
			return _json_error("Produto não disponível", 404)

		if produto.quantidade_estoque < quantidade:
			return _json_error("Quantidade solicitada acima do estoque", 409)

		# Reserve stock by deducting immediately (will commit after loop)
		produto.quantidade_estoque -= quantidade

		item_total = round(produto.preco * quantidade, 2)
		total += item_total
		order_items.append(
			{
				"produto_id": produto.id,
				"nome": produto.nome,
				"quantidade": quantidade,
				"preco_unitario": produto.preco,
				"subtotal": item_total,
			}
		)

	pedido = Pedido(
		estabelecimento_id=estab.id,
		cliente_id=cliente_id,
		endereco_entrega_id=end.id,
		forma_pagamento=forma_pagamento,
		itens=order_items,
		total=round(total, 2),
	)
	db.session.add(pedido)
	db.session.commit()
	return jsonify({"id": pedido.id, "total": pedido.total}), 201


# -----------------------------
# Públicos - Listagem e Pesquisa
# -----------------------------
@api_bp.get("/estabelecimentos")
def listar_estabelecimentos():
	"""List all establishments."""
	estabs = Estabelecimento.query.all()
	return jsonify(
		[{"id": e.id, "nome": e.nome, "endereco": e.endereco_json} for e in estabs]
	), 200


@api_bp.get("/estabelecimento/<int:id_estabelecimento>/produtos")
def listar_produtos_publico(id_estabelecimento: int):
	"""List available products for a given establishment (public)."""
	produtos = (
		Produto.query.filter_by(estabelecimento_id=id_estabelecimento, disponibilidade=True)
		.all()
	)
	return jsonify(
		[
			{
				"id": p.id,
				"nome": p.nome,
				"descricao": p.descricao,
				"preco": p.preco,
				"quantidade_estoque": p.quantidade_estoque,
			}
			for p in produtos
		]
	), 200


@api_bp.get("/pesquisa/produtos")
def pesquisar_produtos():
	"""Search products by term within an establishment, optionally filtering by availability."""
	estabelecimento_id = request.args.get("id_estabelecimento", type=int)
	termo = request.args.get("q", type=str, default="")
	disponivel = request.args.get("disponivel", default="1") in ("1", "true", "True")

	if not estabelecimento_id:
		return _json_error("id_estabelecimento é obrigatório", 400)

	query = Produto.query.filter(Produto.estabelecimento_id == estabelecimento_id)
	if termo:
		like = f"%{termo}%"
		query = query.filter(Produto.nome.ilike(like) | Produto.descricao.ilike(like))
	if disponivel:
		query = query.filter_by(disponibilidade=True)

	produtos = query.all()
	return jsonify(
		[
			{
				"id": p.id,
				"nome": p.nome,
				"descricao": p.descricao,
				"preco": p.preco,
				"quantidade_estoque": p.quantidade_estoque,
			}
			for p in produtos
		]
	), 200


# -----------------------------
# Gemini - Vendedor chat
# -----------------------------
@api_bp.post("/vendedor/chat")
@jwt_required()
def vendedor_chat():
	"""Receive a seller question, enrich with context, and ask Gemini."""
	vendedor_id, err = _require_role("vendedor")
	if err:
		return err

	data = request.get_json(silent=True) or {}
	pergunta = data.get("pergunta")
	if not pergunta:
		return _json_error("Campo obrigatório: pergunta", 400)

	# Build context: basic stats
	estabs = Estabelecimento.query.filter_by(vendedor_id=vendedor_id).all()
	estab_ids = [e.id for e in estabs]
	prod_count = Produto.query.join(Estabelecimento).filter(Estabelecimento.vendedor_id == vendedor_id).count()

	last_30 = datetime.utcnow() - timedelta(days=30)
	pedidos = (
		Pedido.query.filter(
			Pedido.estabelecimento_id.in_(estab_ids) if estab_ids else False,
			Pedido.criado_em >= last_30,
		)
		.all()
	)
	receita = sum(p.total for p in pedidos)
	low_stock = (
		Produto.query.join(Estabelecimento)
		.filter(Estabelecimento.vendedor_id == vendedor_id, Produto.quantidade_estoque < 5)
		.limit(5)
		.all()
	)
	low_stock_str = ", ".join(f"{p.nome}({p.quantidade_estoque})" for p in low_stock) or "nenhum"

	contexto = (
		f"Lojas: {len(estabs)} | Produtos: {prod_count} | Pedidos últimos 30d: {len(pedidos)} | "
		f"Receita últimos 30d: {receita:.2f} | Baixo estoque: {low_stock_str}"
	)

	resposta = ask_gemini(
		f"Contexto do vendedor: {contexto}\nPergunta: {pergunta}\nForneça uma resposta objetiva para o vendedor."
	)
	return jsonify({"resposta": resposta}), 200