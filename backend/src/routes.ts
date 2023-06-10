import { User, UserRole } from "./db/entities/User.js";
import { FastifyInstance, FastifyReply } from "fastify";
import { SOFT_DELETABLE_FILTER } from "mikro-orm-soft-delete";
import {CreateUserBody, ParamType, RatingType, UpdateUserBody} from "./types.js";
import dotenv from "dotenv";
import {Title} from "./db/entities/Title.js";
import {Statement} from "./db/entities/Statement.js";
import {EntityManager} from "@mikro-orm/postgresql";

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
		const { id, name, email, favActor, favFilm, favTVShow, reviews } = req.body;

		const userToChange = await req.em.findOneOrFail(User, id, {strict: true});
		userToChange.name = name;
		userToChange.email = email;
		userToChange.favActor = favActor;
		userToChange.favFilm = favFilm;
		userToChange.favTVShow = favTVShow;
		userToChange.reviews = reviews;

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


	// Search for titles
	app.search("/titles", async(req, reply) => {
		let { titleName } = req.body;
		titleName = titleName.toLowerCase()
		try{
			const matchingTitles = await req.em.find(Title, { primary_title: titleName });
			console.log(matchingTitles)
			reply.send(matchingTitles)
		} catch (err) {
			reply.status(500).send(err);
		}
	});


	// Generate review
	app.post<{ Body: { userId: number | null, titleId: string } }>("/reviews", async (req, reply) => {
		const { userId, titleId } = req.body;
		try{
			const foundTitle = await req.em.findOneOrFail(Title, titleId, {strict: true})

			// Get all main statements that have the same rating type as the title
			const possibleMainStmts = await req.em.find(Statement, {
				paramType: "main",
				ratingType: foundTitle.ratingType,
			});

			// Choose one randomly and add the statement predicates to the response
			let randomOffset = Math.floor(Math.random() * possibleMainStmts.length);
			const mainPreds = possibleMainStmts[randomOffset].predicates;
			let response = { mainStmt: [mainPreds[0], foundTitle.primaryTitle, mainPreds[1]] }

			// If there is a user, add an additional statement using their profile information
			if (userId) {
				const theUser = await req.em.findOneOrFail(User, userId, {strict: true});
				const addonStmt = await getAddonStatement(req.em, theUser, foundTitle.ratingType);
				response["addonStmt"] = addonStmt;
			}
			return reply.send(response)
		} catch (err) {
			reply.status(500).send(err);
		}
	});
}

// Determine an addon statement depending on the review type and profile info
async function getAddonStatement(em: EntityManager, theUser: User, ratingType: RatingType) {
	let possibleParams: ParamType[] = ["favFilm", "favTVShow", "favActor"]
	let index = Math.floor(Math.random() * possibleParams.length);
	let paramType: ParamType | null = null;
	let favValue = "";

	// Start with a random param type and iterate through all types until there is
	// a matching profile field found with which to build an addon statement
	for (let i = 0; i < possibleParams.length; i++) {
		if (possibleParams[index] == "favFilm" && theUser.favFilm) {
			paramType = "favFilm";
			favValue = theUser.favFilm;
			break;
		}
		else if (possibleParams[index] == "favTVShow" && theUser.favTVShow) {
			paramType = "favTVShow";
			favValue = theUser.favTVShow;
			break;
		}
		else if (possibleParams[index] == "favActor" && theUser.favActor) {
			paramType = "favActor";
			favValue = theUser.favActor;
			break;
		}
		index = (index + 1) % possibleParams.length;
	}

	// If the user has one of the optional profile fields populated, build the addon statement
	if (paramType){
		const stmts = await em.find(Statement, {
			paramType: paramType,
			ratingType: ratingType,
		});
		index = Math.floor(Math.random() * stmts.length);
		const addonPreds = stmts[index].predicates;
		return [addonPreds[0], favValue, addonPreds[1]];
	}
	return [];
}

export default FFRoutes;
