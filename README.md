# API de Produtos Node.js

Esta é uma API RESTful simples para cadastro, consulta, atualização e remoção de produtos, desenvolvida com **Node.js**, **Express** e **express-validator**. Os dados são armazenados em memória, ideal para estudos, testes e prototipagem.

## Funcionalidades

- **Listar produtos** com paginação e filtro por nome
- **Consultar produto** por ID
- **Cadastrar produto** com validação de nome e preço
- **Atualizar produto** (nome e/ou preço) com validação
- **Remover produto** por ID
- **Middleware de logging** para monitoramento das requisições

## Como usar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor:
   ```bash
   node index.js
   ```
3. Acesse a API em: [http://localhost:3000](http://localhost:3000)

## Exemplos de rotas

- `GET /produtos?nome=caneta&page=1&limit=5`
- `GET /produtos/1`
- `POST /produtos`  
  Corpo:
  ```json
  { "nome": "Caneta", "preco": 2.5 }
  ```
- `PUT /produtos/1`  
  Corpo:
  ```json
  { "nome": "Caneta Azul", "preco": 3.0 }
  ```
- `DELETE /produtos/1`

## Exemplo de resposta

```json
{
  "total": 1,
  "page": 1,
  "limit": 10,
  "produtos": [
    {
      "id": 1,
      "nome": "Caneta",
      "preco": 2.5
    }
  ]
}
```
