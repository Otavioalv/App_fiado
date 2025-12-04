# AppFiado
Esta API fornece gerenciamento de clientes, fornecedores, produtos e compras, integrada a um sistema simples de fiado.
A aplicação é construída em Node.js + Fastify + TypeScript, organizada em camadas independentes para garantir clareza, manutenção e escalabilidade.
Nessa aplicação, fornecedores adicionam seus produtos, e somente clientes parceiros podem solicitar comprar esses produtos e optar por pagar depois.

## Stack
- Node.js
- Fastify
- PostgreSQL
- TypeScript

## Estrutura
```
src/
 ├── app.ts
 ├── common
 ├── config
 ├── controller
 ├── database
 ├── models
 ├── public
 ├── routers
 ├── router.ts
 ├── server.bkp.ts
 ├── server.ts
 ├── services
 ├── shared
 │   ├── consts
 │   ├── interfaces
 │   ├── utils
 │   └── validators
 └── sockets
```
## Rodar
npm install  
npm start


## Módulos Principais
### 1. Usuários (Cliente/Fornecedor)
* **Criar usuário**
* **Login**
* **Atualizar Dados** Obs: Não implementeado ainda

### 2. Fornecedor
**Rota principal:** ```/fornecedor```
**Exemplo de uso:** ```127.0.0.1:8090/fornecedor/register```

* **Criar conta de Fornecedor**
    * Tipo: **POST**
    * end-point: ```/register```
* **Login**
    * Tipo: **POST**
    * end-point: ```/login```
* **Listar Clientes**
    * Tipo: **POST**
    * end-point: ```/list-clientes```
* **Solicitar parceria com Cliente**
    * Tipo: **POST**
    * end-point: ```/partner```
* **Aceitar parceria com Cliente**
    * Tipo: **POST**
    * end-point: ```/partner/accept```
* **Listar Todos os tipos de parceria**
    * Tipo: **POST**
    * end-point: ```/partner/list```
* **Listar somente parcerias recebidas de Clientes**
    * Tipo: **POST**
    * end-point: ```/partner/list/reseived```
* **Listar somente parcerias enviadas paras Clientes**
    * Tipo: **POST**
    * end-point: ```/partner/list/sent```
* **Listar somente parcerias aceitas dos Clientes** 
    * Tipo: **POST**
    * end-point: ```/partner/list/accepted```
* **Adicionar um produto a lista**
    * Tipo: **POST**
    * end-point: ```/product/add```
* **Listar produtos**
    * Tipo: **POST**
    * end-point: ```/product/list```
* **Atualizar Produto**
    * Tipo: **POST**
    * end-point: ```/product/update```
* **Deletar Produto**
    * Tipo: **POST**
    * end-point: ```/product/delete```
* **Lista Compras com filtros, ou apartir de id de Cliente**
    * Tipo: **POST**
    * end-point: ```/product/buy/list/:toUser?```
* **Aceita compra(s)**
    * Tipo: **POST**
    * end-point: ```/product/accept```
* **Recusa compra(s)**
    * Tipo: **POST**
    * end-point: ```/product/refuse```
* **Atualiza status da(s) compra(s)**
    * Tipo: **POST**
    * end-point: ```/product/purchace/update```
* **Lista Menssagens**
    * Tipo: **POST**
    * end-point: ```/message/list```
* **Deleta Menssagens**
    * Tipo: **POST**
    * end-point: ```/message/delete```



### 2. Cliente
**Rota principal:** ```/cliente```
**Exemplo de uso:** ```127.0.0.1:8090/cliente/register```

* **Criar conta de Cliente**
    * Tipo: **POST**
    * end-point: ```/register```
* **Login**
    * Tipo: **POST**
    * end-point: ```/login```
* **Listar Fornecedores**
    * Tipo: **POST**
    * end-point: ```/list-fornecdores```
* **Solicitar parceria com Forneceedor**
    * Tipo: **POST**
    * end-point: ```/partner```
* **Aceitar parceria com Fornecedor**
    * Tipo: **POST**
    * end-point: ```/partner/accept```
* **Listar Todos os tipos de parceria**
    * Tipo: **POST**
    * end-point: ```/partner/list```
* **Listar somente parcerias recebidas de Fornecedor**
    * Tipo: **POST**
    * end-point: ```/partner/list/reseived```
* **Listar somente parcerias enviadas paras Fornecedor**
    * Tipo: **POST**
    * end-point: ```/partner/list/sent```
* **Listar somente parcerias aceitas dos Fornecedor** 
    * Tipo: **POST**
    * end-point: ```/partner/list/accepted```
* **Comprar Produto**
    * Tipo: **POST**
    * end-point: ```/product/buy```
* **Listar Produto de um Fornecedor parceiro**
    * Tipo **POST**
    * end-point: ```/product/list/:idFornecedor```
* **Lista Compras com filtros, ou apartir de id de Fornecedor**
    * Tipo: **POST**
    * end-point: ```/product/buy/list/:toUser?```
* **Cancela compra(s)**
    * Tipo: **POST**
    * end-point: ```/product/cancel```
* **Lista Menssagens**
    * Tipo: **POST**
    * end-point: ```/message/list```
* **Deleta Menssagens**
    * Tipo: **POST**
    * end-point: ```/message/delete```
