export type CreateUserBody = {
	email: string;
	name: string;
	favActor?: string;
	favFilm?: string;
	favTVShow?: string;
	password: string;
	loginUID: string;
};

export type UpdateUserBody = {
	email: string,
	name: string,
	favActor?: string;
	favFilm?: string;
	favTVShow?: string;
	reviews?: string[];
	loginUID: string;
}

export type TitleType = "movie" | "tvSeries";
export type ParamType = "main" | "favActor" | "favFilm" | "favTVShow";
export type RatingType = "terrible" | "negative" | "average" | "positive" | "exceptional";

export type RawStatement = {
	predicates: string[];
	paramType: ParamType;
	ratingType: RatingType;
};

export type RawTitle = {
	tconst: string;
	titleType: TitleType;
	primaryTitle: string;
	averageRating: string;
	startYear: string;
	genres: string;
};
