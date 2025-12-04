export const ResponseApi = {
    Auth: {
        USER_ALREADY_EXISTS: "Usuário já existe. Realize o login",
        REGISTER_SUCCESS: "Usuário registrado com sucesso",
        LOGIN_SUCCESS: "Login realizado com sucesso",
        INVALID_CREDENTIALS: "Nome de usuário ou senha incorreto",
        PASSWORD_INCORRECT: "Senha incorreta",
        USER_NOT_FOUND: "Usuário não encontrado",
        TOKEN_INVALID: "Token inválido",
        TOKEN_EXPIRED: "Token expirado",
        UNAUTHORIZED: "Não autorizado",
        FORBIDDEN: "Acesso negado",
        LOGOUT_SUCCESS: "Logout realizado com sucesso",
        SESSION_EXPIRED: "Sessão expirada",
    },

    Server: {
        INTERNAL_ERROR: "Erro interno no servidor",
        UNAVAILABLE: "Serviço temporariamente indisponível",
        TIMEOUT: "Tempo de resposta excedido",
    },

    Validation: {
        INVALID_DATA: "Dados inválidos",
        REQUIRED_FIELDS: "Campos obrigatórios ausentes",
        INVALID_FORMAT: "Formato inválido",
        VALUE_NOT_ALLOWED: "Valor não permitido",
        OUT_OF_RANGE: "Valor fora do intervalo permitido",
        INVALID_FILTER: "Um ou mais valores do filtro estão inválidos"
    },

    Purchases: {
        NOT_FOUND: "Uma ou mais compras não existem",
        ACCEPT_SUCCESS: "Compras aceitas com sucesso",
        CANCEL_SUCCESS: "Compra cancelada com sucesso",
        CREATE_SUCCESS: "Compra criada com sucesso",
        UPDATE_SUCCESS: "Compra atualizada com sucesso",
        DELETE_SUCCESS: "Compra removida com sucesso",
        ALREADY_PROCESSED: "Essa compra já foi processada",
    },
    Users: {
        UPDATE_SUCCESS: "Usuário atualizado com sucesso",
        DELETE_SUCCESS: "Usuário removido com sucesso",
        PROFILE_NOT_FOUND: "Perfil não encontrado",
        LIST_SUCCESS: "Lista de usuários carregada com sucesso",
        CLIENT_INVALID: "Cliente Invalido",
        SUPPLIER_INVALID: "Fornecedor Invalido",
    },
    General: {
        LIST_SUCCESS: "Lista carregada com sucesso",
    },
    Partner: {
        LIST_SUCCESS: "Parceria(s) listada(s) com sucesso",
        LIST_ERROR: "Erro ao coletar lista de parcerias",
        NOT_FOUND: "Nenhuma parceria encontrada",
        CREATE_SUCCESS: "Parceria criada com sucesso",
        UPDATE_SUCCESS: "Parceria atualizada com sucesso",
        DELETE_SUCCESS: "Parceria removida com sucesso",
        SUPPLIER_NOT_FOUND: "Um ou mais fornecedores não existem",
        CLIENT_NOT_FOUND: "Um ou mais clientes não existem",
        SUPPLIER_ALREADY_REQUESTED: "Todos estes fornecedores já receberam solicitação de parceria",
        CLIENT_ALREADY_REQUESTED: "Todos estes clientes já receberam solicitação de parceria",
        PARTNER_REQUEST_SENT: "Solicitações enviadas com sucesso",
        PARTNER_ACCEPT: "Parceria aceita com sucesso",
        NOT_PARTNER: "Um ou mais usuários não são associados"
    },
    Product: {
        ADD_SUCCESS: "Produtos adicionados com sucesso",
        LIST_SUCCESS: "Produtos listados com sucesso",
        UPDATE_SUCCESS: "Produto(s) atualizado(s) com sucesso",
        DELETE_SUCCESS: "Produto(s) deletado(s) com sucesso",
        NOT_FOUND: "Algum produto não pôde ser identificado corretamente",
        NOT_EXIST: "Um ou mais produtos não existem ou foram deletados",
        ALL_NOT_FOUND: "Nenhum produto foi encontrado",
    },

    Purchace: {
        PURCHACE_REQUEST_SENT: "Compra solicitada com sucesso",
        UPDATE_STATUS: "Status atualizado com sucesso", 
        UPDATE_PURCHACE: "Compra(s) atualizada(s) com sucesso",
        CANCELL_PURCHACE: "Compra(s) cancelada(s) com sucesso",
        LIST_SUCCESS: "Compra(s) listada(s) com sucesso",
        NOT_EXIST: "Uma ou mais compras não existem ou foram retiradas",
        NOT_FOUND: "Alguma compra não pôde ser identificada corretamente",
    },

    Common: {
        SUCCESS: "Operação realizada com sucesso",
        BAD_REQUEST: "Requisição inválida",
        NOT_FOUND: "Recurso não encontrado",
        CONFLICT: "Conflito de dados",
        CREATED: "Criado com sucesso",
        UPDATED: "Atualizado com sucesso",
        DELETED: "Removido com sucesso",
    },
    Messages: {
        LIST_ERROR: "Erro ao carregar lista de mensagem(s)",
        LIST_SUCCESS: "Lista de mensagem(s) listada(s) com sucesso",
        NOT_FOUND: "Nenhuma mensagem foi encontrada",
        DELETE_SUCCESS: "Mansagem(s) deletada(s) com sucesso",
    }
} as const;
