# App_fiado 
/ Banco de dados (POSTGRES)

pg_dump -U postgres -d appfiado -t fornecedor --schema-only // equivalente a show create table

DATABASE: AppFiado

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

CREATE TABLE fornecedor (
	id_fornecedor serial primary key not null,
    nome character varying(200) not null,
    senha character varying(100) not null,
    apelido character varying(200),
    telefone character varying(20) not null,
	nomeEstabelecimento character varying(200) not null,
    numeroimovel integer,
    logradouro character varying(200) not null,
	bairro character varying(200) not null,
	complemento character varying(200),
    cep character(8) not null,
    uf character(2) not null
);



/ endpoints
/fornecedor

rota: /register
    { 
        "nome": "                  Otavio        ",
        "senha": "Senh a           ",
        "apelido": "",
        "telefone": "9829893",
        "nomeEstabelecimento": "Nome do meu estabelecimento",
        "logradouro": "nome bairro",
        "cep": "55616516",
        "uf": "AM",
        "numeroImovel": "num Rua"
    }

rota: /validateCEP
    {
        cep: "34334334"
    }
    
