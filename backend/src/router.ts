import { FastifyInstance, FastifyPluginOptions } from "fastify";

import { fornecedorRouter } from "./routers/FornecedorRouter";
import { clienteRouter } from "./routers/ClienteRouter";
import { userRouter } from "./routers/UserRouter";

export async function routers(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.register(fornecedorRouter, {prefix: "/fornecedor"});
    fastify.register(clienteRouter, {prefix: "/cliente"});
    fastify.register(userRouter, {prefix: "/user"});
}
