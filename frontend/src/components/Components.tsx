import {useState} from "react";

export const Header = () => {
    return (<div>
        <h1>FilmFlam</h1>
        <h3>Just a bunch of dumb bullshit</h3>
    </div>)
}
export const Button = () => {
    let [clicks, setClicks] = useState(0);
    return (
        <button onClick={() => {
            setClicks(clicks + 1);
        }
        }>
            Clicks: {clicks}
        </button>
    );

}