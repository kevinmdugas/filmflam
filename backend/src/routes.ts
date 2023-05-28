import { User } from "./db/entities/User.js";
import { FastifyInstance, FastifyReply } from "fastify";
import {CreateUserBody, UpdateUserBody} from "./types.js";
import dotenv from "dotenv";

dotenv.config();
const adminPassword = process.env.PASSWORD;

async function FFRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during route construction");
	}

	app.get("/dbTest", async (req, _reply) => {
		return req.em.find(User, {});
	});

	// Create user
	app.post<{ Body: CreateUserBody }>("/users", async (req, reply: FastifyReply) => {
		// Fish data out of request (auto converts from json)
		const { email, name, favActor, favFilm, favTVShow } = req.body;
		try {
			// Get our manager from the plugin we wrote
			const newUser = await req.em.create(User, {
				email,
				name,
				favActor,
				favFilm,
				favTVShow,
			});
			// This will immediately update the real database.  You can store up several changes and flush only once
			// NOTE THE AWAIT -- do not forget it or weirdness abounds
			await req.em.flush();
			app.log.info("Created new user:", newUser);
			return reply.send(newUser);
		} catch (err) {
			app.log.error("Failed to create new user: ", err.message);
			return reply.status(500).send({ message: err.message });
		}
	});

	// Get all users
	app.get("/users", async (req, reply) => {
		try {
			const theUser = await req.em.find(User, {});
			reply.send(theUser);
		} catch (err) {
			reply.status(500).send(err);
		}
	});

	// Retrieve user
	app.search("/users", async (req, reply) => {
		const { id } = req.body;

		try {
			const theUser = await req.em.findOne(User, { id });
			app.log.info(theUser);
			reply.send(theUser);
		} catch (err) {
			app.log.error(err);
			reply.status(500).send(err);
		}
	});

	// Update user
	app.put<{ Body: UpdateUserBody }>("/users", async (req, reply) => {
		const { id, name, favActor, favFilm, favTVShow } = req.body;

		const userToChange = await req.em.findOne(User, { id });
		userToChange.name = name;
		userToChange.favActor = favActor;
		userToChange.favFilm = favFilm;
		userToChange.favTVShow = favTVShow;

		await req.em.flush();
		app.log.info(userToChange);
		reply.send(userToChange);
	});

	// Delete user
	app.delete<{ Body: { id: number; password: string } }>("/users", async (req, reply) => {
		const { id, password } = req.body;

		if (adminPassword !== password) {
			return reply.status(401).send();
		}

		try{
			const theUser = await req.em.findOneOrFail(User, id);
			await req.em.remove(theUser).flush();
			app.log.info(theUser);
			reply.send(theUser);
		} catch(err) {
			app.log.error(err);
			reply.status(500).send(err);
		}
	});
}

export default FFRoutes;
