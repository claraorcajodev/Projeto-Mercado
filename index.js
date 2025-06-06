// Importa o Express e os validadores
const express = require('express');
const {body, validationResult } = require('express-validator');

const app = express();
const PORT = 3000;

// Middleware para aceitar JSON no corpo das requisições
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Simulação de banco de dados em memória
let produtos = []
let idAtual = 1;

/**
 * Função auxiliar: envia erros de validação
 */

function validarRequisicao(req, res, next)
{
    const erros = validationResult(req);
    if (!erros.isEmpty())
        {
        return res.status(400).json({erros: erros.array() });  
        }
    next();
}

/**
 * Rota GET /produtos
 * Lista todos os produtos cadastrados
 */

app.get('/produtos', (req, res) => 
{
  let resultado = [...produtos]; // cópia para evitar efeitos colaterais

  // Filtro por nome

  if (req.query.nome) {
    resultado = resultado.filter(p =>
      p.nome.toLowerCase().includes(req.query.nome.toLowerCase())
    );
  }

  // Paginação

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedProdutos = resultado.slice(start, end);

  res.json({
    total: resultado.length,
    page,
    limit,
    produtos: paginatedProdutos,
  });
});

/**
 * Rota GET /produtos/:id
 * Retorna um produto específico pelo ID
 */

app.get('/produtos/:id', (req, res) => 
{
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ mensagem: 'ID inválido' });
  }
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ mensagem: 'Produto não encontrado' });
  }

  res.json(produto);
});


/**
 * Rota POST /produtos
 * Cria um novo produto com validação de entrada
 */

app.post
(
  '/produtos',
  [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('preco')
      .isFloat({ gt: 0 })
      .withMessage('Preço deve ser um número maior que zero'),
    validarRequisicao,
  ],
  (req, res) => {
    const { nome, preco } = req.body;
    const novoProduto = { id: idAtual++, nome, preco };
    produtos.push(novoProduto);
    res.status(201).json(novoProduto);
  }
);

/**
 * Rota PUT /produtos/:id
 * Atualiza um produto existente com validação
 */
app.put
(
  '/produtos/:id',
  [
    body('nome')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Nome não pode ser vazio'),
    body('preco')
      .optional()
      .isFloat({ gt: 0 })
      .withMessage('Preço deve ser um número maior que zero'),
    validarRequisicao,
  ],

  (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { nome, preco } = req.body;
    const produto = produtos.find(p => p.id === parseInt(id));

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    if (nome) produto.nome = nome;
    if (preco !== undefined) produto.preco = Number(preco);
    res.json(produto);
  }
);

/**
 * Rota DELETE /produtos/:id
 * Remove um produto existente
 */
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const index = produtos.findIndex(p => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ mensagem: 'Produto não encontrado' });
  }

  produtos.splice(index, 1);
  res.status(204).send(); // Sem conteúdo
});

/**
 * Inicia o servidor
 */
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
    

