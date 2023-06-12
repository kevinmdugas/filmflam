import { BrowserRouter } from "react-router-dom";
import "@css/App.css";
import {FilmFlamRoutes} from "@/Routes.tsx";
import {AuthProvider} from "@/services/Auth.tsx";

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
			<AuthProvider>
				<div className="App filmflam">
					<FilmFlamRoutes />
				</div>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
