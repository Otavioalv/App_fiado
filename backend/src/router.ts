import { FastifyInstance, FastifyPluginOptions } from "fastify";

import { fornecedorRouter } from "./routers/fornecedor.router";
import { clienteRouter } from "./routers/cliente.router";
import { userRouter } from "./routers/user.router";

export async function routers(fastify: FastifyInstance, options: FastifyPluginOptions) {
    
    // Rota de teste API OK
    fastify.get('/', async (req, res) => {
        res.status(200).send({ 
            status: 'success', 
            message: 'Teste de api' 
        })
    })


    fastify.register(fornecedorRouter, {prefix: "/fornecedor"});
    fastify.register(clienteRouter, {prefix: "/cliente"});
    fastify.register(userRouter, {prefix: "/user"});
}
