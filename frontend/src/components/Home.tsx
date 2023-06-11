import { useState } from "react";
import {TitleService} from "@/services/TitleService.tsx";
import {Title} from "@/types.ts";

export const Home = () => {
    const [user, setUser] = useState<number | null>(null);
    const [titleInput, setTitleInput] = useState("");
    const [resTitles, setResTitles] = useState<Title[] | null>(null);
    const [searchFail, setSearchFail] = useState(false);
    const [review, setReview] = useState<string[] | null>(null);

    const onSubmitButtonClick = async () => {
        setSearchFail(false);
        setResTitles(null);
        try {
            const titles: Title[] = await TitleService.fetchTitles(titleInput);
            if (titles && titles.length > 0) {
                titles.forEach(title => {
                    title.primaryTitle = capitalizeTitle(title.primaryTitle)
                })
                setResTitles(titles);
            }
            else {
                setSearchFail(true);
            }
        } catch (err) {
            console.error(err)
            setSearchFail(true);
        }
    };

    const handleTitleSelect = (title: Title) => {
        // Handle the selection of a title
        console.log(`Title with ID ${title.id} selected.`);
    };

    function capitalizeTitle(title: string): string {
        return title
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    return (
        <>
            <div className="mt-5">
                <h1 className="mb-3 text-primary">Enter the name of a movie or TV show</h1>
                <input type="title-input"
                       className="form-control text-primary"
                       placeholder="The Fast and the Furious: Tokyo Drift"
                       onChange={(e) => setTitleInput(e.target.value)}
                       id="main-title-query"
                />
            </div>
            {searchFail &&
                <div>
                    <p className="text-warning">Could not find title... Please try again.</p>
                </div>
            }
            <button onClick={onSubmitButtonClick} className="btn btn-primary my-3">Search for Title</button>
            {resTitles &&
                <div>
                    <h2 className="mt-4">Movie and TV Show Titles</h2>
                    {resTitles.length > 1 ?
                        <p className="text-primary mb-4">Select one to generate a new review!</p>
                        :
                        <p className="text-primary mb-4">Confirm this is the correct title to generate a new review!</p>
                    }
                    <div className="title-grid">
                        {resTitles.map((title) =>(
                            <div key={title.id} className="title-container">
                                <div>
                                    <span className="title-primary text-title fs-1 fw-bold fst-italic">{title.primaryTitle}</span>
                                </div>
                                <div>
                                    <span className="title-year">({title.year})</span>
                                </div>
                                <div>
                                    <span className="text-primary">Average Rating: {title.averageRating}</span>
                                </div>
                                <div className="title-genres">
                                    {title.genres.map((genre) => (
                                        <span key={genre} className="genre">{genre}</span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleTitleSelect(title)}
                                    className="btn btn-primary mt-3">
                                    Select
                                </button>
                            </div>
                            ))
                        }
                    </div>
                </div>
            }
        </>
    );
};

