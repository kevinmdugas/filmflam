# FilmFlam

## How to Run

Should only need to run `docker compose up` for entire site to be usable on port 80.
Authentication is implemented with Google Firebase Authentication and it requires the
API_KEY stored in the .env file. 

Note that the database seeds after every `docker compose up`
so any new users you created will not persist once you stop running docker. This is due
to accomodating the static data sets explained below in the next section.

## Datasets

Title data was collected from IMDb's freely available
[Non-Commercial Datasets](https://developer.imdb.com/non-commercial-datasets/).
No information within these datasets is altered by this application. Information
courtesy of IMDb (https://www.imdb.com). Used with permission.

### Title Ingestion

Filmflam uses data taken from two of the above datasets: *title.basics* and *title.ratings*.
The former has basic information about each title, including the name, genre, type
(movie, tvSeries, etc.), and release year of the title while the latter contains the average
rating and number of votes contributing to that rating for each title.
Both datasets have the same cardinality and are related on the `tconst` primary key. It is unclear
why the ratings information is not included in the basic dataset (which would have made my life
much easier).

The original cardinality was (and you're gonna want to sit down for this) almost 10 million records.
This is because IMDb includes rows for many types of visual media, including film shorts, tv movies,
movies, tv shows, and even a row for every episode of every tv show in the set. The
`backend/src/db/ingestion` directory houses the utilities used to reduce and join the datasets into a
final TSV file which is ingested and saved to a json file using the pandas-esque danfojs package.
The records in this json file are loaded into the postgres DB during seeding.

Loading the data into the DB during seeding only takes a few seconds on my Mac laptop, whereas the
process to generate that final json file takes hours. I've added the final dataset to version control 
to avoid needing to do this every time you spin up the docker container. That being said, if you have
a burning curiosity our sadistic need to submit your machine to an immense workload OR you happen to
have an enterprise-grade compute cluster just sort of lying around, the steps are as follows:

1. Download the *title.basics.tsv.gz* and *title.basics.tsv.gz* files from IMDb and unzip them in the ingestion folder.
2. Run the `strip_titles.sh` bash script to filter title rows that aren't either movies or tv shows, reducing
    the dataset from about 10 million to just under 900,000.
3. Run the titleIngestion file with `npx ts-node --esm TitleIngestion.ts` to produce the final dataset. This took
   (and you're gonna want to sit down again, maybe stack two foldable chairs and sit on both) about four
    hours on my local machine since it's doing an inner join on two massive dataframes. I didn't have time
    to figure out how to optimize this process.
