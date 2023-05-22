import {Entity, Property} from "@mikro-orm/core";
import type {TitleType} from "../../types.js";

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
}