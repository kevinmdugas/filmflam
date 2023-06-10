import {Button, Header, UsersList} from "@/components/Components.tsx";
import { useState } from "react";

export const Home = () => {
    const [userId, setUserId] = useState<number | null>(null);
    const [titleInput, setTitleInput] = useState("");
    const [review, setReview] = useState("");
    const [titleError, setTitleError] = useState(false);
    const onSubmit = async (ev) => {
        try {
            await ReviewService
        } catch (err) {
            setTitleError(true);
        }
    }

    return (
        <>
            <form>
                <div className="mb-3">
                    <label htmlFor="main-title-query" className="form-label">Enter the name of a movie or TV show</label>
                    <input type="title-input"
                           className="form-control text-primary"
                           onChange={(e) => setTitleInput(e.target.value)}
                           id="main-title-query"
                    />
                </div>
                <button onClick={onSubmit} type="submit" className="btn btn-primary">Submit</button>
            </form>
        </>
    );
};

