# SeuZé (AppFiado) — Backend

API para gestão de vendas a prazo (fiado), com controle de acesso baseado em relacionamento entre usuários (clientes e fornecedores).

O sistema permite que fornecedores gerenciem seus próprios produtos e clientes, enquanto clientes podem visualizar e comprar apenas de fornecedores com os quais possuem parceria ativa.

---

## 🚀 Principais Características

- Arquitetura organizada em camadas (controller, services, models)
- Sistema multi-tenant (dados isolados por fornecedor)
- Controle de acesso baseado em relacionamento (cliente ↔ fornecedor)
- Validação de regras de negócio no backend (segurança)
- APIs REST com suporte a filtros e consultas dinâmicas
- Comunicação em tempo real com WebSocket (mensagens)

---

## 🧠 Regras de Negócio

- Um cliente **só pode comprar** de fornecedores com parceria aceita
- Fornecedores gerenciam **seus próprios produtos e clientes**
- Parcerias possuem estados:
  - enviada
  - recebida
  - aceita
- Compras precisam ser **aceitas ou recusadas pelo fornecedor**
- Regras são validadas tanto no frontend quanto no backend

---

## 🛠️ Stack

- Node.js
- Fastify
- TypeScript
- PostgreSQL
- Socket.io

---

## 📂 Estrutura do Projeto

```bash
src/
├── app.ts
├── controller/ # Camada de entrada (HTTP)
├── services/ # Regras de negócio
├── models/ # Representação de dados
├── database/ # Conexão e queries
├── routers/ # Definição de rotas
├── sockets/ # Comunicação em tempo real
├── shared/
│ ├── utils
│ ├── validators
│ └── interfaces
└── config/
``` 

---

## ▶️ Como executar

```bash
npm install
npm run dev
```
## 🌐 Servidor padrão
http://localhost:8090


---

## 🔐 Autenticação

- Baseada em JWT  
- Necessária para a maioria das rotas  
- Controle de permissões baseado no tipo de usuário (cliente/fornecedor)  

---

## 📦 Principais Módulos

### 👤 Usuários

- Registro (cliente ou fornecedor)  
- Login  
- Consulta de dados do usuário  

---

### 🏪 Fornecedor (`/fornecedor`)

Responsável por gerenciar produtos, clientes e vendas.

**Funcionalidades:**
- Gerenciar produtos (CRUD)  
- Gerenciar parcerias com clientes  
- Aprovar ou recusar compras  
- Listar compras com filtros  
- Comunicação via mensagens  

---

### 🛒 Cliente (`/cliente`)

Responsável por visualizar fornecedores e realizar compras.

**Funcionalidades:**
- Buscar fornecedores  
- Solicitar parcerias  
- Listar produtos de fornecedores parceiros  
- Realizar compras  
- Cancelar compras  
- Comunicação via mensagens  

---

## 🔄 Fluxo Principal

1. Cliente e fornecedor criam contas  
2. Um deles solicita parceria  
3. O outro aceita  
4. Cliente pode visualizar produtos  
5. Cliente realiza compra  
6. Fornecedor aprova ou recusa  

---

## 📡 Comunicação em Tempo Real

- Implementação com Socket.io  
- Utilizado para sistema de mensagens entre usuários  

---

## 📌 Observações

- Projeto focado em regras de negócio reais (não apenas CRUD)  
- Estrutura preparada para escalabilidade  
- Separação clara de responsabilidades (camadas)  

---

## 📱 Frontend

O frontend está localizado em:


frontend/seuZe


**Desenvolvido com:**
- React Native (Expo)  
- Integração completa com esta API  

---

## 📎 Objetivo do Projeto

Construir uma solução prática para gestão de vendas a prazo entre pequenos fornecedores e clientes, com controle de acesso, organização de dados e automação de processos.