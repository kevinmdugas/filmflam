import { Home } from "./Components.js";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "@css/App.css";

//Screens
// - Home - not logged in
//      - has the query bar where you type in a movie or tv show title
//      - A field that shows the output of that query or is invisible if there
//          isn't one
//      - Log in/sign up button
// - Login
//      - Single box with email and password
//      - Also include sign up button
//      - Also can return to home
// - Sign up
//      - Single box with each of the fields, only email and password is required
//      - Also include login button
//      - Also can return home
// - Home - logged in
//      - Profile button to show profile screen
//      - Log out button
//      - Queries now return part with fav field - either random or they can
//          choose the type (actor, film, tv show)
//      -

function App() {
	return (
		<BrowserRouter>
			<div className="App">
				<nav>
					<div className="menu">
						<Link to="/">Home </Link>
						<Link to="/login"> Log In </Link>
						<Link to="/signup"> Sign Up </Link>
						<Link to="/about"> About </Link>
					</div>
				</nav>
				<Routes>
					{""}
					<Route path="/" element={<Home />} />
					{/*<Route path="/login" element={<Login />} />*/}
					{/*<Route path="/signup" element={<Signup />} />*/}
					{/*<Route path="/about" element={<About />} />*/}
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
