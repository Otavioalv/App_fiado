import { FastifyInstance, FastifyPluginOptions } from "fastify";

const fornecedor = require("./routers/FornecedorRouter");

export async function routers(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.register(fornecedor, {prefix: "/fornecedor"});
}