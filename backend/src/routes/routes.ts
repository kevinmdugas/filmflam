import { User, UserRole } from "../db/entities/User.js";
import { FastifyInstance, FastifyReply } from "fastify";
import { SOFT_DELETABLE_FILTER } from "mikro-orm-soft-delete";
import {CreateUserBody, UpdateUserBody} from "../types.js";
import dotenv from "dotenv";
import {UserRoutes} from "./UserRoutes.js";

dotenv.config();

async function FFRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during route construction");
	}

	app.get("/dbTest", async (req, _reply) => {
		return req.em.find(User, {}, { filters: { [SOFT_DELETABLE_FILTER]: false } });
	});

	UserRoutes(app);
}

export default FFRoutes;
