import { Entity, Property } from "@mikro-orm/core";
import { FilmFlamBaseEntity } from "./FilmFlamBaseEntity.js";
import type { ParamType, RatingType } from "../../types.js";

@Entity()
export class Statement extends FilmFlamBaseEntity {
	@Property()
	predicates!: string[];

	@Property()
	paramType!: ParamType;

	@Property()
	ratingType: RatingType;
}
