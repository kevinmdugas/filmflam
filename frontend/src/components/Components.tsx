import {useState, useEffect} from "react";
import axios from "axios";

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

export const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            const users = await axios.get(
                "http://[::1]:8080/users"
            );
            setUsers(users.data);
        };
        void getUsers();
    }, []);

    return (
        <div>
            <h2>Users:</h2>
            {    users ?
                <ul>{users.map((user: {email: string, name: string}) => <li key={user.email.toString()}>{user.name} - {user.email}</li>)}</ul>
                : null
            }
        </div> );
};