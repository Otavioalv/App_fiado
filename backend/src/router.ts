import { FastifyInstance, FastifyPluginOptions } from "fastify";

const shopkeeper = require("./routers/shopkeeperRouter");

export async function routers(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.register(shopkeeper, {prefix: "/shopkeeper"});
}