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


CREATE TABLE cart_items (
    id_cart_item SERIAL PRIMARY KEY,
    
    fk_cart_id INTEGER NOT NULL,
    fk_id_produto INTEGER NOT NULL,
    fk_id_fornecedor INTEGER NOT NULL,
    
    fk_cliente_fornecedor_id BIGINT,
    
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


    CONSTRAINT fk_cart_items_cliente_fornecedor
        FOREIGN KEY (fk_cliente_fornecedor_id)
        REFERENCES cliente_fornecedor(id_cliente_fornecedor)
        ON DELETE CASCADE
);



-- Função que seta fk_cliente_fornecedor_id automaticamente
CREATE OR REPLACE FUNCTION set_fk_cliente_fornecedor()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.fk_cliente_fornecedor_id IS NULL THEN
        SELECT cf.id_cliente_fornecedor
        INTO NEW.fk_cliente_fornecedor_id
        FROM cliente_fornecedor cf
        JOIN cart c ON c.fk_id_cliente = cf.fk_cliente_id
        WHERE c.id_cart = NEW.fk_cart_id
          AND cf.fk_fornecedor_id = NEW.fk_id_fornecedor
        LIMIT 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que chama a função antes do insert
CREATE TRIGGER trg_set_fk_cliente_fornecedor
BEFORE INSERT ON cart_items
FOR EACH ROW
EXECUTE FUNCTION set_fk_cliente_fornecedor();