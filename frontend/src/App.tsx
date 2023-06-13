import { BrowserRouter } from "react-router-dom";
import "@css/App.css";
import { FilmFlamRoutes } from "@/Routes.tsx";
import { AuthProvider } from "@/services/Auth.tsx";

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
