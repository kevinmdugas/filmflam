# FilmFlam

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
much easier but c'est la vie).

The original cardinality was (and you're gonna want to sit down for this) almost 10 million records.
This is because IMDb includes rows for many types of visual media, including film shorts, tv movies,
movies, tv shows, and even a row for every episode of every tv show in the set. The
`backend/src/db/ingestion` directory houses the utilities used to reduce and join the title and
ratings datasets that can be run to update or reproduce the final dataset which. The steps are as follows:

1. Download the *title.basics.tsv.gz* and *title.basics.tsv.gz* files from IMDb.
2. Run the `strip_titles.sh` bash script to filter title rows that aren't either movies or tv shows, reducing
    the dataset from about 10 million to just under 900,000.
3. Run the ingestion file with `npx ts-node --esm ingestion.ts` to produce the final dataset. This took
   (and you're gonna want to sit down again, maybe stack two foldable chairs and sit on both) about four
    hours on my local machine since it's doing an inner join on two massive datasets. I didn't have time
    to figure out how to optimize this process.

I've added the final dataset to version control to avoid needing to do this every time you spin up
the docker container.
