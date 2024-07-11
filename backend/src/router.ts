import { FastifyInstance, FastifyPluginOptions } from "fastify";

const fornecedor = require("./routers/FornecedorRouter");
const cliente = require("./routers/ClienteRouter");
const source = require("./routers/SourceRouter");

export async function routers(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.register(fornecedor, {prefix: "/fornecedor"});
    fastify.register(cliente, {prefix: "/cliente"});
    fastify.register(source, {prefix: "/"});
}