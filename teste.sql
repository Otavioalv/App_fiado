CREATE TABLE cliente_fornecedor (
	id_cliente_fornecedor serial PRIMARY KEY,  
    
    cliente_check boolean default FALSE,
    fornecedor_check boolean default FALSE,

    fk_cliente_id integer NOT NULL REFERENCES cliente(id_cliente) ON DELETE CASCADE, 
	fk_fornecedor_id integer NOT NULL REFERENCES fornecedor(id_fornecedor) ON DELETE CASCADE, 
	
    UNIQUE(fk_cliente_id, fk_fornecedor_id)
);

INSERT INTO cliente_fornecedor 
    (cliente_check, fornecedor_check, fk_cliente_id, fk_fornecedor_id)
VALUES
    (TRUE, FALSE, 1, 1),
    (TRUE, FALSE, 1, 2),
    (TRUE, FALSE, 1, 3),
    (TRUE, FALSE, 1, 5),
    (TRUE, FALSE, 1, 6),
    (FALSE, TRUE, 2, 6),
    (FALSE, TRUE, 3, 6),
    (FALSE, TRUE, 4, 6),
    (FALSE, TRUE, 5, 5),
    (FALSE, TRUE, 6, 5),
    (FALSE, TRUE, 7, 5),
    (FALSE, TRUE, 8, 5),
    (FALSE, TRUE, 9, 5),
    (FALSE, TRUE, 10, 5),
    (FALSE, TRUE, 11, 6),
    (FALSE, TRUE, 12, 6),
    (FALSE, TRUE, 13, 6),
    (FALSE, TRUE, 14, 6),
    (FALSE, TRUE, 15, 6),
    (FALSE, TRUE, 16, 6),
    (FALSE, TRUE, 17, 6),
    (FALSE, TRUE, 102, 6);
