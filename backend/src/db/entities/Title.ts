import {Entity, Property} from "@mikro-orm/core";
import {BaseEntity} from "./BaseEntity.js";
import type {TitleType} from "../../types.js";

/*
Ingested from the ingestion/FinalTitleSet.json file
 */
@Entity()
export class Title extends BaseEntity {
    @Property()
    titleType!: TitleType;

    @Property()
    primaryTitle!: string;

    @Property()
    averageRating!: Number;
}