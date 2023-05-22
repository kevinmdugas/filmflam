import { Entity, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";

/*
    steps to create and save a review
    - request for a statement comes in and it contains
        - title
        - user
    - retrieve the title and the user
    - with the title, construct a statement
        - get the rating
        - define the ratingType (terrible)
        - get a statement from db that has the following traits
            - paramType == "main"
            - ratingType == "terrible"
        - Construct a main string with with this statement
            - "I saw Fast and Furious the other day. It was terrible!"
        - Check to see if user has any of the optional params in their account
            - Randomly check one of each of the three until one is found
            - If none are found, return string
            - Say in this case we saw that the actor is Vin Diesel
        - Retrieve another statement with the following traits
            - parmaType == "actor"
            - ratingType == "terrible"
        - Construct another string with this statement
            - " Not even Vin Diesel could save this trainwreck"
        - Append to the original string
            - "I saw Fast and Furious the other day. It was terrible!
                Not even Vin Diesel could save this trainwreck!"
        - Return string
        - Client will recieve that string and ask if they want to save it as
            a review in their profile. If yes, they will send a request to
            add the string to their list of reviews.
            - request: email, review string
 */
@Entity({ tableName: "users" })
export class User extends BaseEntity {
	@Property()
	@Unique()
	email!: string;

	@Property()
	name!: string;

	@Property()
	favActor?: string;

	@Property()
	favFilm?: string;

	@Property()
	favTVShow?: string;

	@Property()
	reviews?: string[];
}
