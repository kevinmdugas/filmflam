import dotenv from "dotenv";
import Fastify, {FastifyReply, FastifyRequest} from "fastify";
import {FastifyMikroOrmPlugin} from "./plugins/mikro.js";
import config from "./db/mikro-orm.config.js"
import {User} from "./db/entities/User.js"
dotenv.config();

const app = Fastify();
await app.register(FastifyMikroOrmPlugin, config)

app.get('/hi', async (request: FastifyRequest, reply: FastifyReply) => {
    return 'Hilo';
});

app.get("/dbTest", async (req, reply) => {
    return req.em.find(User, {});
});
app.listen({ port: Number(process.env.PORT) },
    (err: Error, address: string) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Started server at ${address}`);
    }
);