import {useState} from "react";
import {TitleService} from "@/services/TitleService.tsx";
import {Title, Review} from "@/types.ts";
import {ReviewService} from "@/services/ReviewService.tsx";
import {UserService} from "@/services/UserService.tsx";
import {useAuth} from "@/services/Auth.tsx";

export const Home = () => {
    const [titleInput, setTitleInput] = useState("");
    const [resTitles, setResTitles] = useState<Title[] | null>(null);
    const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
    const [searchFail, setSearchFail] = useState(false);
    const [review, setReview] = useState<Review | null>(null);
    const [reviewFail, setReviewFail] = useState(false);
    const [reviewSaved, setReviewSaved] = useState(false);
    const auth = useAuth()

    const onSubmitButtonClick = async () => {
        setSearchFail(false);
        setResTitles(null);
        setReview(null);
        setReviewFail(false);
        setSelectedTitle(null);
        setReviewSaved(false);
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

    const handleTitleSelect = async (title: Title | null) => {
        setReviewSaved(false);
        if (!title) {
            console.error("Cannot generate a review, title is null");
            return;
        }

        // Variable that allows us to regenerate reviews, only set if null to avoid re-renders
        if (!selectedTitle) {
            setSelectedTitle(title);
        }

        try{
            let loginUID: string | null = null
            if (auth && auth.user){
                loginUID = auth.user.loginUID;
            }
            const review: Review = await ReviewService.generateReview(title.id, loginUID);
            review.mainStmt[1] = capitalizeTitle(review.mainStmt[1])
            setReview(review)
        } catch (err) {
            console.error(err)
            setReviewFail(true);
        }
    };

    function capitalizeTitle(title: string): string {
        return title
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    function formatReview(review: Review): string {
        let finalReview = review.mainStmt[0] + review.mainStmt[1] + review.mainStmt[2]
        if (review.addonStmt) {
            finalReview += review.addonStmt[0] + review.addonStmt[1] + review.addonStmt[2]
        }
        return finalReview;
    }

    const handleSaveReview = async () => {
        if (!review || !auth || !auth.user)
            return;
        const formattedReview = formatReview(review);
        if (!auth.user.reviews)
            auth.user.reviews = [formattedReview]
        else
            auth.user.reviews.push(formattedReview);
        try {
            await UserService.updateUser(auth.user);
            setReviewSaved(true);
        } catch (err) {
            console.error("Cannot save review: ", err)
        }
    }

    return (
        <>
            <div className="mt-5">
                <h1 className="text-primary">Enter the name of a movie or TV show</h1>
                <small className="mb-3">(from 1991 or later. Don't ask why.)</small>
                <input type="title-input"
                       className="form-control text-primary mt-3"
                       placeholder="The Fast and the Furious: Tokyo Drift"
                       onChange={(e) => setTitleInput(e.target.value)}
                       id="main-title-query"
                />
            </div>
            {searchFail &&
                <div className="mt-3">
                    <p className="text-warning">Could not find title... Please try again.</p>
                </div>
            }
            {reviewFail &&
                <div className="mt-3">
                    <p className="text-warning">Could not generate a review... Please try again.</p>
                </div>
            }
            <button onClick={onSubmitButtonClick} className="btn btn-primary my-3">Search for Title</button>
            {resTitles && !review &&
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
                                    <span className="text-title fs-1 fw-bold fst-italic">{title.primaryTitle}</span>
                                </div>
                                <div>
                                    <span className="title-year">({title.year} {title.titleType == "movie" ? "Movie" : "TV Show"})</span>
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
                                    className="btn btn-primary my-3">
                                    Select
                                </button>
                            </div>
                            ))
                        }
                    </div>
                </div>
            }
            {review && (
                <>
                    <div>
                        <h2 className="mt-4">Review for {review.mainStmt[1]}</h2>
                    </div>
                    <div>
                        <blockquote className="blockquote">
                            <p className="text-title fst-italic">"{formatReview(review)}"</p>
                        </blockquote>
                    </div>
                    <div>
                        <button onClick={() => handleTitleSelect(selectedTitle)} className="btn btn-primary m-3">Generate Another Review</button>
                        {auth?.user && !reviewSaved &&
                            <button onClick={handleSaveReview} className="btn btn-primary m-3">Save Review</button>
                        }
                        {auth?.user && reviewSaved &&
                            <button className="btn btn-primary m-3 disabled">Review Saved</button>
                        }
                        {!auth?.user &&
                            <button className="btn btn-primary m-3 disabled">Log In to Save Review</button>
                        }
                    </div>
                </>

            )}
        </>
    );
};

