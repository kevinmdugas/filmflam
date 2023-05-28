import { User, UserRole } from "./db/entities/User.js";
import { FastifyInstance, FastifyReply } from "fastify";
import { SOFT_DELETABLE_FILTER } from "mikro-orm-soft-delete";
import {CreateUserBody, UpdateUserBody} from "./types.js";
import dotenv from "dotenv";

dotenv.config();

async function FFRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during route construction");
	}

	app.get("/dbTest", async (req, _reply) => {
		return req.em.find(User, {}, { filters: { [SOFT_DELETABLE_FILTER]: false } });
	});

	// Create user
	app.post<{ Body: CreateUserBody }>("/users", async (req, reply: FastifyReply) => {
		// Fish data out of request (auto converts from json)
		const { email, name, favActor, favFilm, favTVShow, password } = req.body;
		try {
			// Get our manager from the plugin we wrote
			const newUser = await req.em.create(User, {
				email,
				name,
				favActor,
				favFilm,
				favTVShow,
				role: UserRole.USER,
				password
			});
			// This will immediately update the real database.  You can store up several changes and flush only once
			// NOTE THE AWAIT -- do not forget it or weirdness abounds
			await req.em.flush();
			return reply.send(newUser);
		} catch (err) {
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
			const theUser = await req.em.findOneOrFail(User, id, {strict: true});
			reply.send(theUser);
		} catch (err) {
			reply.status(500).send(err);
		}
	});

	// Update user
	app.put<{ Body: UpdateUserBody }>("/users", async (req, reply) => {
		const { id, name, favActor, favFilm, favTVShow } = req.body;

		const userToChange = await req.em.findOneOrFail(User, id, {strict: true});
		userToChange.name = name;
		userToChange.favActor = favActor;
		userToChange.favFilm = favFilm;
		userToChange.favTVShow = favTVShow;

		await req.em.flush();
		reply.send(userToChange);
	});

	// Delete user
	app.delete<{ Body: { my_id: number; id_to_delete: number, password: string } }>("/users", async (req, reply) => {
		const { my_id, id_to_delete, password } = req.body;

		try{
			const me = await req.em.findOneOrFail(User, my_id, {strict: true});

			if (me.password !== password) {
				return reply.status(401).send();
			}

			if (me.role === UserRole.USER) {
				return reply.status(401).send({ "message": "You are not an admin!"})
			}

			const userToDelete = await req.em.findOneOrFail(User, id_to_delete, {strict: true});

			if (userToDelete.role === UserRole.ADMIN) {
				return reply.status(401).send({"message": "You do not have enough privileges to delete an Admin!"})
			}
			await req.em.remove(userToDelete).flush();
			return reply.send(userToDelete);
		} catch(err) {
			reply.status(500).send(err);
		}
	});
}

export default FFRoutes;
