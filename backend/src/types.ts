export type CreateUserBody = {
    email:      string,
    name:       string,
    favActor?:  string,
    favFilm?:   string,
    favTVShow?: string,
}