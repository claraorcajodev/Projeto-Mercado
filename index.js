// Importa o Express e os validadores
const express = require('express');
const {body, validationResult } = require('express-validator');

const app = express();
const PORT = 3000;

// Middleware para aceitar JSON no corpo das requisições
app.use(express.json());

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
        res.json(produtos);
        });

/**
 * Rota POST /produtos
 * Cria um novo produto com validacao de entrada
 */

app.post(
    '/produtos',
        [
        body('nome').notEmpty().withMessage('Nome é obrigatório'),
        body('preco')
        .isFloat({gt: 0})
        .withMessage('Preço deve ser um número maior que zero'),
        validarRequisicao,  
        ],
        (req, res) => 
        {
        res.json(produtos);
        }
    );
    
/**
 * Rota POST /produtos
 * Cria um novo produto com validação de entrada
 */
app.post(
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
app.put(
  '/produtos/:id',
  [
    body('nome').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('preco')
      .optional()
      .isFloat({ gt: 0 })
      .withMessage('Preço deve ser um número maior que zero'),
    validarRequisicao,
  ],
  (req, res) => {
    const { id } = req.params;
    const { nome, preco } = req.body;
    const produto = produtos.find(p => p.id === parseInt(id));

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    if (nome) produto.nome = nome;
    if (preco) produto.preco = preco;

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
    

