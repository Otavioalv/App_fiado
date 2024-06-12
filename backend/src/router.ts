import { FastifyInstance, FastifyPluginOptions } from "fastify";

const fornecedor = require("./routers/FornecedorRouter");
const source = require("./routers/SourceRouter");

export async function routers(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.register(fornecedor, {prefix: "/fornecedor"});
    fastify.register(source, {prefix: "/"});
}