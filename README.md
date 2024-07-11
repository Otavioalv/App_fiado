# App fiado

## Banco de dados (POSTGRES)

obs: fazer geração de id aleatoria

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

-- provavelmente cliente nao precisa de informações de endereço
-- criar outra tabela pra associar aos produtos
CREATE TABLE cliente (
    id_cliente SERIAL NOT NULL primary key,
    nome character varchar(200),
    senha character varchar(100),
    apelido character varchar(200),
    telefone character varchar(20),
);


```

Tabela fornecedor:
```
CREATE TABLE fornecedor (
    id_fornecedor SERIAL NOT NULL primary key,
	nome varchar(200) NOT NULL,
    senha varchar(300) NOT NULL,
    apelido varchar(200),
    telefone varchar(20),
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
    disponivel boolean NOT NULL,
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
