import {useState, useEffect} from "react";
import axios from "axios";

export const Header = () => {
    return (<div>
        <h1>FilmFlam</h1>
        <h3>Just a bunch of dumb bullshit</h3>
    </div>)
}
// export const Button = () => {
//     let [clicks, setClicks] = useState(0);
//     return (
//         <button onClick={() => {
//             setClicks(clicks + 1);
//         }
//         }>
//             Clicks: {clicks}
//         </button>
//     );
// }
//
// export const Users = () => {
//     const [users, setUsers] = useState([]);
//
//     useEffect(() => {
//         const getUsers = async () => {
//             const users = await axios.get(
//                 "http://[::1]:8080/users"
//             );
//             setUsers(users.data);
//         };
//         void getUsers();
//     }, []);
//
//     return (
//         <div>
//             <h2>Users:</h2>
//             {    users ?
//                 <ul>{users.map((user: {email: string, name: string}) => <li key={user.email.toString()}>{user.name} - {user.email}</li>)}</ul>
//                 : null
//             }
//         </div> );
// };
export const Button = () => {
    const [clicks, setClicks] = useState(0);
    const [users, setUsers] = useState([]);

    // useEffect is how we implement asynchronous code in React's declarative setting;
    // we just tell react what we want, in this case to get all users, and we let react
    // figure out how it actually does that.
    useEffect( () => {

        const getUsers = async () => {
            const usersRes = await axios.get("http://localhost:8080/users");
            setUsers(usersRes.data);
        };

        getUsers();
        // The dependencies list contains things that, when they change, you want this
        // useEffect to run again. For example, if I add the clicks variable to the dependencies,
        // the users would be retrieved every time the button is clicked. Since there are no
        // dependencies, the users are only retrieved once in the entire application lifetime.
    }, []);


    return (
        <button
            onClick={() => {
                console.log(users);
                setClicks(clicks + 1);
            }}
        >
            Clicks: {clicks}
        </button>
    );
};

