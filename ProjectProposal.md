# FilmFlam

FilmFlam is a future Fortune 500, somehow ethical multinational conglomerate whose beginnings will be traced back to this humble website. Its name is a play on the word "flimflam" (pronounced flim-flam) which, according to [Merriam-Webster](https://www.merriam-webster.com/dictionary/flimflam), is in fact an actual word that means "deceptive nonsense". I would venture to say, dear reader, that there could be no better moniker for a website as monumentally stupid as this one.

## Features

FilmFlam will allow the user to type in a movie or show title and other parameters (such as lead actor) that are used to search for that title in [IMDb's freely accessible datasets](https://www.imdb.com/interfaces/). It will then produce a perfectly crafted talking point about that title based on the rating, in case anyone asks you if you've seen it.

The responses will be associated with a discreet rating range. For example, suppose a queried movie rating is less than 5.0. A response for that movie might be:

```bash
"OMG {title} is such garbage, I can't believe {lead actor} would agree to self-destruct their career like that."
```

Users can also create an account and for the low low price of $0 tri-annually, create a user profile for "premium" content that logs all of your past queries so that you can keep your web of lies straight, while also allowing you to give personal info that's woven intricately into the responses. For example, suppose your favorite actor is Vin Diesel and you're afraid everyone at Janice's birthday party on Saturday will laugh at you because you've never seen The Room. You'll be able to wow Janice and her mean friends with this insightful response:

```bash
"OMG The Room is such garbage, I can't believe Tommy Wiseau would agree to self-destruct their career like that!!! Now if Vin Diesel were on there..."
```

Note: The `!!!` affectation indicates that you should be yelling if giving this response verbally, otherwise nobody will take you seriously.

## Functionality

- Frontend will likely be written in Bootstrap (and look suspiciously similar to my static portfolio website)
- User authentication & profiles
- Database with movie information, responses, and user data
- Website runs in a Docker container
