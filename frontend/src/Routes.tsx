import {Link, Route, Routes} from "react-router-dom";
import {Home} from "@/components/Home.tsx";

export function FilmFlamRoutes() {
    return (
        <>
            <nav className="navbar fixed-top navbar-expand-lg bg-body-secondary">
                <div className="container-fluid">
                    <Link className="navbar-brand text-title" to="/">FilmFlam </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="main-nav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button className="bg-body-secondary">
                                    <Link className="text-primary" to="/">Home </Link>
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="bg-body-secondary">
                                    <Link className="text-primary" to="/login"> Log In </Link>
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="bg-body-secondary">
                                    <Link className="text-primary" to="/signup"> Sign Up </Link>
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="bg-body-secondary">
                                    <Link className="text-primary" to="/about"> About </Link>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<Home />}/>
                {/*<Route path="/login" element={<Login />} />*/}
                {/*<Route path="/signup" element={<Signup />} />*/}
                {/*<Route path="/about" element={<About />} />*/}
            </Routes>
        </>
    )
}
