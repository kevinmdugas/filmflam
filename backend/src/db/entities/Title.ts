import { Entity, Property } from "@mikro-orm/core";
import type {RatingType, TitleType} from "../../types.js";

/*
Ingested from the ingestion/FinalTitleSet.json file
 */
@Entity()
export class Title {
	@Property({ primary: true })
	id!: string;

	@Property()
	titleType!: TitleType;

	@Property()
	primaryTitle!: string;

	@Property()
	averageRating!: string;

	@Property()
	ratingType!: RatingType;

	@Property()
	year!: string;

	@Property()
	genres!: string[];
}
