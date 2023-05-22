import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Title } from "../entities/Title.js";
import {RawTitle} from "../../types.js";
import {fileURLToPath} from "url";
import fs from "fs";
import path from "path";

export class TitleSeeder extends Seeder {
    async run(em: EntityManager, context: Dictionary): Promise<void> {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const dataPath = path.join(__dirname, "..", "ingestion", "FinalTitleSet.json");

        const fileContent = fs.readFileSync(dataPath, 'utf8');
        const data: RawTitle[] = JSON.parse(fileContent)
        for (let i = 0; i < data.length; i++){
            context.stmt = em.create(Title, {
                id: data[i].tconst,
                titleType: data[i].titleType,
                primaryTitle: data[i].primaryTitle,
                averageRating: data[i].averageRating
            });
        }
    }
}
