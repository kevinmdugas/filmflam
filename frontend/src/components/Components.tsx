import { useState, useEffect } from "react";
import axios from "axios";

export const Header = () => {
	return (
		<div>
			<h1 className="text-title">FilmFlam
			<small className="text-body-secondary"> Just a bunch of dumb bullshit</small>
			</h1>
		</div>
	);
};

export const Button = () => {
	const [clicks, setClicks] = useState(0);

	return (
		<button
			onClick={() => {
				setClicks(clicks + 1);
			}}
		>
			Clicks: {clicks}
		</button>
	);
};

export const UsersList = () => {
	const [users, setUsers] = useState([]);

	// useEffect is how we implement asynchronous code in React's declarative setting;
	// we just tell react what we want, in this case to get all users, and we let react
	// figure out how it actually does that.
	useEffect(() => {
		const getUsers = async () => {
			const usersRes = await axios.get("http://localhost:8080/users");
			setUsers(usersRes.data);
		};

		void getUsers();
		// The dependencies list contains things that, when they change, you want this
		// useEffect to run again. For example, if I add the clicks variable to the dependencies,
		// the users would be retrieved every time the button is clicked. Since there are no
		// dependencies, the users are only retrieved once in the entire application lifetime.
	}, []);
	return (
		<div>
			<h2>Users:</h2>
			{users ? (
				<ul>
					{users.map((user: { email: string; name: string }) => (
						<li key={user.email}>
							{user.name} - {user.email}
						</li>
					))}
				</ul>
			) : (
				<p>No users found</p>
			)}
		</div>
	);
};
