import { httpClient } from "@/services/HttpService.tsx";
import { User } from "@/types.js";

export const UserService = {
	async fetchUser(loginUID: string) {
		const response = await httpClient.search("/users", { loginUID });
		return response.data;
	},

	async createUser(theUser: User) {
		try {
			await httpClient.post("/users", {
				loginUID: theUser.loginUID,
				email: theUser.email,
				name: theUser.name,
				password: theUser.password,
				favFilm: theUser.favFilm,
				favActor: theUser.favActor,
				favTVShow: theUser.favTVShow,
			});
		} catch (err) {
			console.error(err);
		}
	},

	async updateUser(theUser: User) {
		await httpClient.put("/users", {
			loginUID: theUser.loginUID,
			reviews: theUser.reviews,
		});
	},
};
