CREATE TABLE cliente_fornecedor (
	id_cliente_fornecedor serial PRIMARY KEY,  
    
    cliente_check boolean default FALSE,
    fornecedor_check boolean default FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    fk_cliente_id integer NOT NULL REFERENCES cliente(id_cliente) ON DELETE CASCADE, 
	fk_fornecedor_id integer NOT NULL REFERENCES fornecedor(id_fornecedor) ON DELETE CASCADE, 
	
    UNIQUE(fk_cliente_id, fk_fornecedor_id)
);

CREATE TABLE IF NOT EXISTS compra (
    id_compra SERIAL,

    nome_produto TEXT,
    quantidade INTEGER,
    valor_unit NUMERIC(10,2),

    quitado BOOLEAN DEFAULT FALSE,
    retirado BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    prazo TIMESTAMP NOT NULL, 

    fk_cliente_id INTEGER NOT NULL REFERENCES cliente(id_cliente) ON DELETE CASCADE,
    fk_fornecedor_id INTEGER NOT NULL REFERENCES fornecedor(id_fornecedor) ON DELETE CASCADE
);



INSERT INTO cliente_fornecedor 
    (cliente_check, fornecedor_check, fk_cliente_id, fk_fornecedor_id)
VALUES
    (TRUE, FALSE, 4, 4),
    (FALSE, TRUE, 1, 1),
    (TRUE, TRUE, 1, 2),
    (TRUE, TRUE, 1, 3),
    (TRUE, TRUE, 1, 4),
    (TRUE, TRUE, 1, 10),
    (TRUE, TRUE, 1, 8),
    (TRUE, TRUE, 1, 9),
    (TRUE, TRUE, 1, 20),
    (FALSE, TRUE, 5, 5),
    (FALSE, TRUE, 6, 5),
    (FALSE, TRUE, 7, 5),
    (FALSE, TRUE, 8, 5),
    (FALSE, TRUE, 9, 5),
    (FALSE, TRUE, 10, 5),
    (TRUE, TRUE, 1, 5),
    (FALSE, TRUE, 2, 6),
    (FALSE, TRUE, 3, 6),
    (FALSE, TRUE, 4, 6),
    (FALSE, TRUE, 11, 6),
    (FALSE, TRUE, 12, 6),
    (FALSE, TRUE, 13, 6),
    (FALSE, TRUE, 14, 6),
    (FALSE, TRUE, 15, 6),
    (FALSE, TRUE, 7, 6),
    (FALSE, TRUE, 8, 6),
    (FALSE, TRUE, 9, 6),
    (FALSE, TRUE, 16, 6),
    (FALSE, TRUE, 17, 6),
    (FALSE, TRUE, 102, 6),
    (TRUE, TRUE, 5, 6),
    (TRUE, TRUE, 6, 6),
    (TRUE, TRUE, 10, 6),
    (TRUE, TRUE, 18, 6),
    (TRUE, TRUE, 19, 6),
    (TRUE, TRUE, 20, 6),
    (TRUE, TRUE, 21, 6),
    (TRUE, TRUE, 22, 6),
    (TRUE, TRUE, 23, 6);



AlTER TABLE cliente 
ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT NOW();

ALTER TABLE fornecedor
ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT NOW();

ALTER TABLE produto
ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT NOW();