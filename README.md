# App fiado

## Banco de dados (POSTGRES)

mostrar a tabela criada: ``` pg_dump -U <usuario> -d <nomeBD> -t <nomeTabela> --schema-only // equivalente a show create table ```

Criar bando de dados: ```CREATE DATABASE AppFiado;```

Tabela cliente:

```
CREATE TABLE public.cliente (
    nome character varying(200),
    senha character varying(100),
    apelido character varying(200),
    telefone character varying(20),
    numeroimovel integer,
    logradouro character varying(200),
    cep character(8),
    uf character(2)
);
```

Tabela fornecedor:

```
CREATE TABLE public.fornecedor (
    nome character varying(200),
    senha character varying(100),
    apelido character varying(200),
    telefone character varying(20),
    numeroimovel integer,
    logradouro character varying(200),
    cep character(8),
    nomeestabelecimento character varying(200),
    uf character(2)
);
```

## End-points

### **source:** **"/"**

**rota:** *"/validateCEP"*

**JSON:**

```
    {
        "cep": "34334334"
    }
```

<!-- > [!IMPORTANT]  
> Crucial information necessary for users to succeed. -->
