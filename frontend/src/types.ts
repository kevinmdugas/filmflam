export type State = {
	user: Profile | undefined;
};

export type Profile = {
	id: number;
	name: string;
	email: string;
	favFilm: string;
	favActor: string;
	favTVShow: string;
	reviews: string[];
};
