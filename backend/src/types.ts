export type CreateUserBody = {
    email:      string,
    name:       string,
    favActor:   string | undefined,
    favFilm:    string | undefined,
    favTVShow:  string | undefined,
}