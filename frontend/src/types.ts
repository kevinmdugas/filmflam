export type User = {
	loginUID: string;
	name: string;
	email: string;
	password: string;
	favFilm?: string;
	favActor?: string;
	favTVShow?: string;
	reviews: string[];
};

export type Title = {
	id: string,
	titleType: string,
	primaryTitle: string,
	averageRating: string,
	genres: string[],
	year: string
}

export type Review = {
	mainStmt: string[],
	addonStmt?: string[],
}