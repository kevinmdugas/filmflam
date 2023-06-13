import { Entity, Property, Unique } from "@mikro-orm/core";
import { SoftDeletable } from "mikro-orm-soft-delete";
import { FilmFlamBaseEntity } from "./FilmFlamBaseEntity.js";
import { Enum } from "@mikro-orm/core";

export enum UserRole {
	ADMIN = 'Admin',
	USER = 'User'
}

@SoftDeletable(() => User, "deleted_at", () => new Date())
@Entity({ tableName: "users" })
export class User extends FilmFlamBaseEntity {
	@Property()
	@Unique()
	loginUID: string;

	@Property()
	@Unique()
	email!: string;

	@Property()
	name!: string;

	@Property()
	password!: string;

	@Enum(() => UserRole)
	role!: UserRole;

	@Property()
	favActor?: string;

	@Property()
	favFilm?: string;

	@Property()
	favTVShow?: string;

	@Property()
	reviews?: string[];
}
