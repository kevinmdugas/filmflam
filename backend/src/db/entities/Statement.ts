import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import type { ParamType, RatingType } from "../../types.js";

/*
    - Every row of this table represents a statement that might be returned for a particular title depending
    on its rating
    - The threshold determines when it is a candidate to be invoked: rating <5: Negative,
    - Columns
        - predicates: the statements that are used around a param (main, actor, film, tvShow)
        - paramType: Main, Actor, Film, TV
        - ratingType:
            - Terrible (0 - 4.9)
            - Negative (5 - 6.9)
            - Average (7 - 7.9)
            - Positive (8 - 8.9)
            - Exceptional (9 - 10)
        - example records:
                {
                    predicates: ["I saw ", " the other day. It was terrible!"],
                    paramType: Main,
                    ratingType: Terrible
                }
                {
                    predicates: ["Not even ", " could save this trainwreck."]
                    paramType: Actor
                    ratingType: Terrible
                 }
 */
@Entity()
export class Statement extends BaseEntity {
	@Property()
	predicates!: string[];

	@Property()
	paramType!: ParamType;

	@Property()
	ratingType: RatingType;
}
