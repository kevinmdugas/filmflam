import * as dfd from "danfojs-node";
import path from "path";
import { fileURLToPath } from "url";

function ingestion() {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const ratingsPath = path.join(__dirname, "title.ratings.tsv");
	const titlePath = path.join(__dirname, "title_stripped.tsv");
	const finalPath = path.join(__dirname, "FinalTitleSet_staging.json");

	console.log("Reading ratings data...");
	dfd
		.readCSV(ratingsPath)
		.then((rdf) => {
			rdf = rdf.drop({ columns: ["numVotes"] });
			console.log("Reading title data...");
			dfd
				.readCSV(titlePath)
				.then((tdf) => {
					console.log("Df heads prior to merging");
					rdf.head().print();
					tdf.head().print();

					console.log("Merging Dataframes on the tconst column...");
					const merged = dfd.merge({ left: tdf, right: rdf, on: ["tconst"], how: "inner" });

					console.log("Final merged dataframe");
					merged.head().print();
					dfd.toJSON(merged, { filePath: finalPath });
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => {
			console.log(err);
		});
}
ingestion();
