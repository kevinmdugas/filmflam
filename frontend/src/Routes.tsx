import {Link, Route, Routes} from "react-router-dom";
import {Home} from "@/components/Home.tsx";
import {SignUpPage} from "@/components/SignUp.tsx";
import {LoginPage} from "@/components/Login.tsx";
import {ProfilePage} from "@/components/ProfilePage.tsx";
import {ProtectedRoute} from "@/components/ProtectedRoute.tsx";
import {useAuth} from "@/services/Auth.tsx";

export function FilmFlamRoutes() {
    const auth = useAuth();
    return (
        <>
            <nav className="navbar fixed-top navbar-expand bg-body-secondary shadow-lg">
                <div className="container-fluid">
                    <div>
                        <Link className="navbar-brand text-title fs-1 fw-bold fst-italic" to="/">FilmFlam </Link>
                    </div>
                    <div className="collapse navbar-collapse justify-content-end" id="main-nav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button>
                                    <Link className="text-primary text-decoration-none" to="/">Home </Link>
                                </button>
                            </li>
                            {auth?.userId == null ? (
                                <>
                                    <li className="nav-item">
                                        <button>
                                            <Link className="text-primary text-decoration-none" to="/login"> Log In </Link>
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button>
                                            <Link className="text-primary text-decoration-none" to="/signup"> Sign Up </Link>
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <button>
                                            <Link className="text-primary text-decoration-none" to="/profile"> Profile </Link>
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button>
                                            <Link className="text-primary text-decoration-none" to="/logout"> Log Out </Link>
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            </Routes>
        </>
    )
}
