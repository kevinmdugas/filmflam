import { User } from "./db/entities/User.js";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CreateUserBody } from "./types.js";

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
			console.log("Created new user:", newUser);
			return reply.send(newUser);
		} catch (err) {
			console.log("Failed to create new user: ", err.message);
			return reply.status(500).send({ message: err.message });
		}
	});

	// We have to use .route() here because we need a non-standard http method, SEARCH
	// app.route<{Body: { email: string }}>({
	//     method: "SEARCH",
	//     url: "/users",
	//
	//     handler: async(req, reply) =>
	//     {
	//         const { email } = req.body;
	//         console.log("Email is: ", email);
	//         try {
	//             const theUser = await req.em.findOne(User, { email });
	//             console.log(theUser);
	//             reply.send(theUser);
	//         } catch (err) {
	//             console.error(err);
	//             reply.status(500).send(err);
	//         }
	//     }
	// });

	// Retrieve user
	app.search<{ Body: { email: string } }>("/users", async (req, reply) => {
		const { email } = req.body;

		try {
			const theUser = await req.em.findOne(User, { email });
			console.log(theUser);
			reply.send(theUser);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});

	// Update user
	app.put<{ Body: CreateUserBody }>("/users", async (req, reply) => {
		const { email, name, favActor, favFilm, favTVShow } = req.body;

		const userToChange = await req.em.findOne(User, { email });
		userToChange.name = name;
		userToChange.favActor = favActor;
		userToChange.favFilm = favFilm;
		userToChange.favTVShow = favTVShow;

		await req.em.flush();
		console.log(userToChange);
		reply.send(userToChange);
	});

	// Delete user
	app.delete<{ Body: { email: string } }>("/users", async (req, reply) => {
		const { email } = req.body;

		// using reference is enough, no need for a fully initialized entity
		const userToDelete = await req.em.findOne(User, { email });
		if (userToDelete) {
			const msg = `Deleting user with email: ${email}`;
			console.log(msg);
			await req.em.remove(userToDelete).flush();
			reply.send(msg);
		} else {
			const err = `Could not delete user with email: ${email}`;
			console.error(err);
			reply.status(500).send(err);
		}
	});
}

export default FFRoutes;
