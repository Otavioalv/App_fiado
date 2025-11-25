# App fiado

lista por data em dec
limitar quantidade da lista de associados em cliente/fornecedor
limitar quantidade de qualquer lista cliente/fornecedor

# Anotações
## Banco de dados (POSTGRES)

obs: fazer geração de id aleatoria

mostrar a tabela criada: ``` pg_dump -U <usuario> -d <nomeBD> -t <nomeTabela> --schema-only // equivalente a show create table ```

Criar bando de dados: ```CREATE DATABASE AppFiado;```
CREATE EXTENSION IF NOT EXISTS unaccent;
Tabela cliente:

```
CREATE TABLE public.cliente (
    nome character varying(200) /*definir como unique key*/,
    senha character varying(100),
    apelido character varying(200),
    telefone character varying(20),
    numeroimovel integer,
    logradouro character varying(200),
    cep character(8),
    uf character(2)
);

-- provavelmente cliente nao precisa de informações de endereço
CREATE TABLE cliente (
    id_cliente SERIAL NOT NULL primary key ,
    nome varchar(200) NOT NULL /*definir como unique key*/,
    senha varchar(100) NOT NULL,
    apelido varchar(200),
    telefone varchar(20) -- Unike key
);


```

Tabela fornecedor:
```
CREATE TABLE fornecedor (
    id_fornecedor SERIAL NOT NULL primary key,
	nome varchar(200) NOT NULL /*definir como unique key*/,
    senha varchar(300) NOT NULL,
    apelido varchar(200),
    telefone varchar(20) ,
    numeroimovel varchar(5),
    logradouro varchar(200),
    cep character(8) NOT NULL,
    nomeestabelecimento varchar(200) NOT NULL,
    uf character(2),
    complemento varchar(200),
    bairro varchar(200)
);
```

Tabela produto: 
```
CREATE TABLE produto (
    id_produto serial NOT NULL primary key,
    nome varchar(200) NOT NULL,
    preco numeric(10,2) NOT NULL,
    quantidade int NOT NULL,
    fk_id_fornecedor integer REFERENCES fornecedor(id_fornecedor) ON DELETE CASCADE
); 

CREATE OR REPLACE FUNCTION update_disponivel()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.quantidade > 0 THEN
		NEW.disponivel := TRUE;
	ELSE
		NEW.disponivel := FALSE;
	END IF;
	
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_disponivel 
BEFORE INSERT OR UPDATE ON produto
for EACH ROW 
EXECUTE FUNCTION update_disponivel();
```

Tabela associação com cliente e fornecedor (N : N)
```
CREATE TABLE cliente_fornecedor (
	id_cliente_fornecedor serial PRIMARY KEY,  
    
    cliente_check boolean default FALSE,
    fornecedor_check boolean default FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    fk_cliente_id integer NOT NULL REFERENCES cliente(id_cliente) ON DELETE CASCADE, 
	fk_fornecedor_id integer NOT NULL REFERENCES fornecedor(id_fornecedor) ON DELETE CASCADE, 
	
    UNIQUE(fk_cliente_id, fk_fornecedor_id)
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




<!-- 

1 - (cliente) solicitar parceria 
2 - (fornecedor) aceita ou nao parceria
3 - (fornecedor/cliente) parceria aceita ou nao

tabela, campos 
- solicitado true
- aceito false

 -->

Na rota onde o cliente faz compra, emitir notificação
import { notify } from "../sockets/notify";

export const buyProductController = (app) => async (req, res) => {
    const { idFornecedor, idCliente, produto } = req.body;

    // ... lógica de compra no banco

    notify(app).toUser(idFornecedor, "nova-compra", {
        cliente: idCliente,
        produto
    });

    return res.send({ ok: true });
};
