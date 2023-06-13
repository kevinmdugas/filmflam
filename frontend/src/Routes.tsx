import {Link, Route, Routes} from "react-router-dom";
import {Home} from "@/components/Home.tsx";
import {SignUpPage} from "@/components/SignUp.tsx";
import {LoginPage} from "@/components/Login.tsx";
import {ProfilePage} from "@/components/ProfilePage.tsx";
import {ProtectedRoute} from "@/components/ProtectedRoute.tsx";
import {useAuth} from "@/services/Auth.tsx";
import {useState} from "react";

export function FilmFlamRoutes() {
    const auth = useAuth();
    const [showLogout, setShowLogout] = useState(false);

    const Logout = () => {
        const handleLogout = () => {
            console.log("Logging out")
            auth?.logout()
            setShowLogout(false);
        };

        const handleCancel = () => {
            console.log('Cancel');
            setShowLogout(false);
        };

        return (
            <div>
                {showLogout && (
                    <div className="modal" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content bg-light">
                                <div className="modal-header bg-light">
                                    <h5 className="modal-title text-title fw-bold fst-italic">Log Out</h5>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to log out?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                                        Yes
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showLogout && <div className="modal-backdrop fade show" />}
            </div>
        );
    };

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
                                <Link className="btn btn-primary bg-body-secondary text-primary text-decoration-none" to="/">Home </Link>
                            </li>
                            {auth?.user == null ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="btn btn-primary bg-body-secondary text-primary text-decoration-none" to="/login"> Log In </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="btn btn-primary bg-body-secondary text-primary text-decoration-none" to="/signup"> Sign Up </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="btn btn-primary bg-body-secondary text-primary text-decoration-none" to="/profile"> Profile </Link>
                                    </li>
                                    <li className="nav-item">
                                        <button onClick={() => setShowLogout(true)} className="btn btn-primary bg-body-secondary text-primary text-decoration-none"> Logout </button>
                                    </li>
                                </>
                            )}
                        </ul>
                        {showLogout &&
                            <>
                                <Logout />
                            </>
                        }
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
