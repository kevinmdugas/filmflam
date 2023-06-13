import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { User, UserRole } from "../entities/User.js";

export class UserSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {
		context.user1 = em.create(User, {
			name: "Bob",
			email: "email@email.com",
			favActor: "Vin Diesel",
			favFilm: "Fast and Furious 8",
			favTVShow: "My Family is Your Family: The Life and Times of Vin Diesel",
			role: UserRole.ADMIN,
			password: "adminPassword",
			loginUID: "Sqhi8Pu1sSMavKfdN4cSrjwJrMs1",
		});

		context.user2 = em.create(User, {
			name: "Dick",
			email: "email2@email.com",
			favActor: "Adam Sandler",
			favFilm: "The Wedding Singer",
			role: UserRole.USER,
			password: "password",
			loginUID: "fXEa4b5Q1QMEiQehr5TUz6Z5ENa2",
		});

		context.user3 = em.create(User, {
			name: "Alice",
			email: "email3@email.com",
			favActor: "Bob Ross",
			favFilm: "The Joy of Painting",
			role: UserRole.USER,
			password: "password",
			loginUID: "KUdNXSVtQtXAhXK2eGlaBhTSDox2",
		});

		context.user4 = em.create(User, {
			name: "Janet",
			email: "email4@email.com",
			role: UserRole.USER,
			password: "password",
			loginUID: "Rp1g6b6RwMPPuTqOxOxblzCiy1n2",
		});

		context.user5 = em.create(User, {
			name: "John",
			email: "email5@email.com",
			favTVShow: "The first six seasons of Game of Thrones",
			role: UserRole.USER,
			password: "password",
			loginUID: "i2XqUlkqnOU9Dy0e8tGiD8eCFBr1",
		});
	}
}
