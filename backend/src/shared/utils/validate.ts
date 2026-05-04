// import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
// import { ZodSchema } from "zod";

// type Schemas = {
//     body?: ZodSchema;
//     params?: ZodSchema;
//     query?: ZodSchema;
//     headers?: ZodSchema;
// };

// export const validate = (schemas: Schemas) => {
//     return async (req: FastifyRequest, res:  FastifyReply) => {

//         if (schemas.body) {
//             const result = schemas.body.safeParse(req.body);
//             if (!result.success) return formatError(res, result.error);
//             req.body = result.data;
//         }

//         if (schemas.params) {
//             const result = schemas.params.safeParse(req.params);
//             if (!result.success) return formatError(res, result.error);
//             req.params = result.data;
//         }

//         if (schemas.query) {
//             const result = schemas.query.safeParse(req.query);
//             if (!result.success) return formatError(res, result.error);
//             req.query = result.data;
//         }

//         if (schemas.headers) {
//             const result = schemas.headers.safeParse(req.headers);
//             if (!result.success) return formatError(res, result.error);
//             req.headers = result.data;
//         }
//     };
// };

// const formatError = (res: FastifyReply, error) => {
//     return res.status(400).send({
//         message: "Dados inválidos",
//         // errors: error.errors.map(err => ({
//         //     field: err.path.join("."),
//         //     message: err.message
//         // }))
//     });
// };
