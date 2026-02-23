CREATE TABLE cart (
    id_cart SERIAL PRIMARY KEY,
    
    fk_id_cliente INTEGER NOT NULL UNIQUE,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_cart_cliente
        FOREIGN KEY (fk_id_cliente)
        REFERENCES cliente(id_cliente)
        ON DELETE CASCADE
);


CREATE TABLE cart_items (
    id_cart_item SERIAL PRIMARY KEY,
    
    fk_cart_id INTEGER NOT NULL,
    fk_id_produto INTEGER NOT NULL,
    fk_id_fornecedor INTEGER NOT NULL,
    
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    prazo TIMESTAMP NOT NULL,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (fk_cart_id)
        REFERENCES cart(id_cart)
        ON DELETE CASCADE,

    CONSTRAINT fk_cart_items_produto
        FOREIGN KEY (fk_id_produto)
        REFERENCES produto(id_produto)
        ON DELETE CASCADE,

    CONSTRAINT fk_cart_items_fornecedor
        FOREIGN KEY (fk_id_fornecedor)
        REFERENCES fornecedor(id_fornecedor)
        ON DELETE CASCADE,

    CONSTRAINT unique_cart_product
        UNIQUE (fk_cart_id, fk_id_produto, fk_id_fornecedor)
);

