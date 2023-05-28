import Fastify, { FastifyInstance } from "fastify";
import { FastifyMikroOrmPlugin } from "./plugins/mikro.js";
import config from "./db/mikro-orm.config.js";
import FFRoutes from "./routes.js";
import { FastifySearchHttpMethodPlugin } from "./plugins/http_search.js";

const envToLogger = {
    development: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
        level: "debug",
    },
    production: {
        level: "error"
    },
    test: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
        level: "warn"
    },
};

const app: FastifyInstance = Fastify({
    logger: envToLogger[process.env.NODE_ENV]
});
await app.register(FastifyMikroOrmPlugin, config);
await app.register(FastifySearchHttpMethodPlugin);
await app.register(FFRoutes, {});

export default app;
