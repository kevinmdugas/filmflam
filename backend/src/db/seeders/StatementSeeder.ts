import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import {DefaultStatements} from "../ingestion/DefaultStatements.js";
import { Statement } from "../entities/Statement.js";
import {RawStatement} from "../../types.js";

export class StatementSeeder extends Seeder {
    async run(em: EntityManager, context: Dictionary): Promise<void> {

        const data: RawStatement[] = DefaultStatements()
        for (let i = 0; i < data.length; i++){
            context.stmt = em.create(Statement, {
                predicates: data[i].predicates,
                paramType: data[i].paramType,
                ratingType: data[i].ratingType
            });
        }
    }
}
