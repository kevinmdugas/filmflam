import dotenv from "dotenv";
import Fastify, {FastifyReply, FastifyRequest} from "fastify";
dotenv.config();

const app = Fastify();

app.get('/hi', async (request: FastifyRequest, reply: FastifyReply) => {
    return 'Hilo';
});

app.listen({ port: 8080 },
    (err: Error, address: string) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Started server at ${address}`);
    }
);