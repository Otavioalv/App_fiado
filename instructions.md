## Requisitos do Servidor

Para executar o backend corretamente, o servidor precisa atender aos seguintes requisitos mínimos.

### Node.js

O backend foi desenvolvido para rodar em **Node.js moderno**.

Versão recomendada utilizada no desenvolvimento:

```
Node.js v24.4.0
```

Versões LTS recentes geralmente também funcionam, porém recomenda-se utilizar uma versão atual para evitar incompatibilidades.

### Banco de Dados

O sistema utiliza:

```
PostgreSQL
```

É necessário ter um servidor PostgreSQL acessível com permissões para:

* criar tabelas
* criar índices
* criar sequences
* executar scripts SQL

A estrutura completa do banco está no arquivo:

```
./backend/structure.sql
```

### Framework do Backend

O servidor da API foi desenvolvido utilizando:

```
Fastify
```

Portanto, qualquer ambiente que suporte **Node.js + Fastify** será compatível.

### Requisitos gerais do servidor

O servidor precisa permitir:

* execução de aplicações Node.js
* conexão externa com PostgreSQL
* configuração de variáveis de ambiente





# Instruções de Instalação e Execução

Este projeto é dividido em duas partes:

* **Backend (API)**
* **Frontend (Aplicativo Expo / React Native)**

Siga as instruções abaixo para configurar corretamente.

---

# 1. Configuração do Banco de Dados

Dentro da pasta:

```
./backend
```

existe um arquivo chamado:

```
structure.sql
```

Esse arquivo contém **toda a estrutura do banco de dados** (tabelas, índices, constraints, etc).

Crie um banco de dados PostgreSQL vazio e depois execute:

```bash
psql -U SEU_USUARIO -d NOME_DO_BANCO -f structure.sql
```

Antes disso, você precisa coletar os seguintes dados do seu banco:

* Usuário do banco
* Senha
* Host
* Nome do banco
* Porta

Essas informações serão usadas na configuração do `.env`.

---

# 2. Configuração do Backend

Entre na pasta:

```
./backend
```

Crie um arquivo chamado:

```
.env
```

Use o arquivo:

```
.env.example
```

como referência para preencher as variáveis.

---

## Variáveis obrigatórias

As seguintes variáveis são **essenciais para o funcionamento do sistema**:

```
PSQL_USER
PSQL_PASSWORD
PSQL_HOST
PSQL_DATABASE
PSQL_PORT
DATABASE_URL
SALTS_ROUNDS_PASSWORD
JWT_SECRET
```

### JWT_SECRET

A variável:

```
JWT_SECRET
```

deve conter **uma chave aleatória segura**.

Exemplo para gerar uma chave:

```bash
openssl rand -hex 32
```

⚠️ **Importante**

* Nunca compartilhe essa chave
* Nunca altere essa chave depois que o sistema estiver em produção
* Guarde com segurança máxima

Alterar essa chave invalida todos os tokens de autenticação existentes.

---

## Variáveis opcionais

Algumas variáveis dependem da forma como o servidor está configurado:

```
API_HOST
API_PORT
```

Para **testes locais**, você pode definir manualmente.

Em servidores de hospedagem (cloud, containers, etc), essas variáveis podem ser definidas automaticamente pelo próprio ambiente.

---

## Hospedagem em servidores

Alguns servidores **não utilizam arquivos `.env` diretamente**.

Nesse caso, configure as variáveis de ambiente diretamente no painel do servidor.

As variáveis mínimas necessárias são:

```
PSQL_USER
PSQL_PASSWORD
PSQL_HOST
PSQL_DATABASE
PSQL_PORT
DATABASE_URL
SALTS_ROUNDS_PASSWORD
JWT_SECRET
```

---

# 3. Iniciando o Backend

Dentro da pasta:

```
./backend
```

Execute:

```bash
npm install
```

Depois compile o projeto:

```bash
npm run build
```

E inicie o servidor:

```bash
npm run start
```

---

# 4. Configuração do Aplicativo

Abra a pasta do aplicativo:

```
./frontend/seuze
```

Instale as dependências:

```bash
npm install
```

---

# 5. Rodando o aplicativo

Para executar o app:

```bash
npm run android
```

Você pode usar:

* um **celular Android conectado via USB**
* um **emulador Android**

Caso necessário, consulte a documentação oficial do Expo.

---

# 6. Gerar APK para testes

Para gerar um APK de testes:

```bash
npm run build-prev
```

---

# 7. Gerar build para Play Store

Para gerar a versão de produção para a Play Store:

```bash
npx expo prebuild
npx eas build --platform android --profile production
```

Isso irá gerar um arquivo:

```
.aab
```

que é o formato exigido pela Google Play Store.

---

# Observações Importantes

* O aplicativo **não acessa o banco de dados diretamente**
* Toda comunicação é feita através da **API do backend**
* Nunca exponha segredos do servidor no aplicativo
* O aplicativo utiliza apenas variáveis públicas como:

```
EXPO_PUBLIC_API_URL
```

---
