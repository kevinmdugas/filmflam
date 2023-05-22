export type CreateUserBody = {
    email:      string,
    name:       string,
    favActor?:  string,
    favFilm?:   string,
    favTVShow?: string,
}

export type TitleType = "movie" | "tvSeries";
export type ParamType = "main" | "favActor" | "favMovie" | "favTVShow";
export type RatingType = "terrible" | "negative" | "average" | "positive" | "exceptional";

export type RawStatement = {
    predicates: string[],
    paramType: ParamType,
    ratingType: RatingType
}

export type RawTitle = {
    tconst: string,
    titleType: TitleType,
    primaryTitle: string,
    averageRating: string,
}
