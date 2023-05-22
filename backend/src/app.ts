import Fastify, { FastifyInstance } from "fastify";
import { FastifyMikroOrmPlugin } from "./plugins/mikro.js";
import config from "./db/mikro-orm.config.js";
import FFRoutes from "./routes.js";
import { FastifySearchHttpMethodPlugin } from "./plugins/http_search.js";

const app: FastifyInstance = Fastify();
await app.register(FastifyMikroOrmPlugin, config);
await app.register(FastifySearchHttpMethodPlugin);
await app.register(FFRoutes);

export default app;
