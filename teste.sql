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
    id_compra SERIAL PRIMARY KEY,

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



CREATE TABLE IF NOT EXISTS mensagens (
    id_mensagem SERIAL PRIMARY KEY, 
    mensagem TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(), 
    
    from_user_id INTEGER NOT NULL, 
    to_user_id INTEGER NOT NULL, 
    
    from_user_type VARCHAR(10) NOT NULL CHECK(from_user_type IN ('cliente', 'fornecedor', 'system')),
    to_user_type VARCHAR(10) NOT NULL CHECK(to_user_type IN ('cliente', 'fornecedor', 'all')),
    type VARCHAR(50) NOT NULL
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


delete from cliente_fornecedor where fk_cliente_id = 1 and fk_fornecedor_id = 6;

DELETE FROM cliente_fornecedor 
WHERE (fk_cliente_id = 1 OR fk_cliente_id = 24 OR fk_cliente_id = 25 )  AND
fk_fornecedor_id = 6;

DELETE FROM cliente_fornecedor 
WHERE (fk_fornecedor_id = 80 OR fk_fornecedor_id = 81 OR fk_fornecedor_id = 82 OR fk_fornecedor_id = 83)  AND
fk_cliente_id = 111;







-- X listar individual
-- listar tudo
-- listar de parceiros

-- id_produto
-- nome_prod
-- preco
-- quantidade,

-- nome_fornecedor
-- nome estabelecimento
-- partner status



SELECT 
    p.id_produto,
    p.nome AS nome_prod,
    p.preco,
    p.quantidade,
    p.fk_id_fornecedor AS id_fornecedor,
    f.nome AS nome_fornecedor,
    f.nomeestabelecimento,
    COALESCE(cf.cliente_check, FALSE) AS cliente_check,
    COALESCE(cf.fornecedor_check, FALSE) AS fornecedor_check,
    CASE 
        WHEN cf.cliente_check = TRUE AND cf.fornecedor_check = TRUE THEN 'ACCEPTED'
        WHEN cf.cliente_check = TRUE THEN 'SENT'
        WHEN cf.fornecedor_check = TRUE THEN 'RECEIVED'
        ELSE 'NONE'
    END AS relationship_status
FROM 
    produto AS p
LEFT JOIN 
    cliente_fornecedor AS cf
    ON
        p.fk_id_fornecedor = cf.fk_fornecedor_id
    AND
        cf.fk_cliente_id = 153
LEFT JOIN  
    fornecedor AS f
    ON
        p.fk_id_fornecedor = f.id_fornecedor;



-- adiciona valores aleatorios a produto
INSERT INTO produto (nome, preco, quantidade, fk_id_fornecedor)
SELECT
  p.nome,
  round((random() * 40 + 3)::numeric, 2) AS preco,
  (random() * 300)::int + 10          AS quantidade,
  f.id                                AS fk_id_fornecedor
FROM (VALUES
  (297),(298),(300),(303),(305),(308),(309),(310),(311),(313)
) AS f(id)
CROSS JOIN (VALUES
  ('Arroz Branco Tipo 1'),
  ('Feijão Carioca'),
  ('Óleo de Soja 900ml'),
  ('Açúcar Cristal 1kg'),
  ('Café Torrado e Moído 500g'),
  ('Leite Integral 1L'),
  ('Macarrão Espaguete 500g'),
  ('Farinha de Trigo 1kg')
) AS p(nome);



INSERT INTO cliente_fornecedor (
  cliente_check,
  fornecedor_check,
  created_at,
  fk_cliente_id,
  fk_fornecedor_id
)
SELECT
  (random() < 0.5) AS cliente_check,
  (random() < 0.5) AS fornecedor_check,
  now() - (random() * interval '30 days') AS created_at,
  153 AS fk_cliente_id,
  f.id AS fk_fornecedor_id
FROM (VALUES
  (483), (456), (457), (458), (459), (460), 
  (461), (462), (463), (464), (466), (468), 
  (469), (475), (477), (479), (481)
) AS f(id);



INSERT INTO compra (
  nome_produto,
  quantidade,
  valor_unit,
  quitado,
  retirado,
  created_at,
  prazo,
  fk_cliente_id,
  fk_fornecedor_id,
  aceito,
  coletado_em,
  cancelado
)
SELECT
  p.nome_produto,
  (random() * 20)::int + 1                       AS quantidade,
  round((random() * 40 + 5)::numeric, 2)         AS valor_unit,

  (random() < 0.6)                               AS quitado,

  r.retirado,

  now() - (random() * interval '20 days')        AS created_at,
  now() + (random() * interval '15 days')        AS prazo,

  153                                            AS fk_cliente_id,
  f.id                                           AS fk_fornecedor_id,

  (random() < 0.7)                               AS aceito,

  CASE
    WHEN r.retirado = true
      THEN now() - (random() * interval '5 days')
    ELSE NULL
  END                                            AS coletado_em,

  r.cancelado
FROM (VALUES
  (297),(298),(300),(303),(305),
  (308),(309),(310),(311),(313)
) AS f(id)
CROSS JOIN (VALUES
  ('Arroz Branco Tipo 1'),
  ('Feijão Carioca'),
  ('Óleo de Soja 900ml'),
  ('Açúcar Cristal 1kg'),
  ('Café Torrado e Moído 500g')
) AS p(nome_produto)
CROSS JOIN LATERAL (
  SELECT
    (random() < 0.5)  AS retirado,
    (random() < 0.1)  AS cancelado
) r;

