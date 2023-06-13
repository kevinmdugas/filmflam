import { useState } from 'react';
import {useAuth} from "@/services/Auth.tsx";

export const SignUpPage = () => {
    const auth = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        favActor: '',
        favFilm: '',
        favTVShow: ''
    });
    const [authFail, setAuthFail] = useState(false);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const success = await auth?.createAccount({
            loginUID: "",
            name: formData.name,
            email: formData.email,
            password: formData.password,
            favFilm: formData.favFilm,
            favActor: formData.favActor,
            favTVShow: formData.favTVShow,
            reviews: []
        });
        if (success) {
            console.log("Account creation successful")
            setAuthFail(false);
        } else {
            console.error("Account creation failed")
            setAuthFail(true);
        }
    };

    return (
        <div className="container rounded m-5 bg-body-secondary">
            <h2 className="text-title fs-1 fw-bold fst-italic mb-3 pt-3">Sign Up</h2>
            <div className="mb-3">
                <label htmlFor="email" className="form-label text-primary mt-2">
                    Email Address<span className="text-danger">*</span>
                </label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="name" className="form-label text-primary">
                    Name<span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="password" className="form-label text-primary">
                    Password<span className="text-danger">*</span>
                </label>
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="favoriteActor" className="form-label text-primary">
                    Favorite Actor
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="favActor"
                    name="favActor"
                    value={formData.favActor}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="favoriteFilm" className="form-label text-primary">
                    Favorite Film
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="favFilm"
                    name="favFilm"
                    value={formData.favFilm}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="favoriteTVShow" className="form-label text-primary">
                    Favorite TV Show
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="favTVShow"
                    name="favTVShow"
                    value={formData.favTVShow}
                    onChange={handleChange}
                />
            </div>

            {authFail &&
                <p className="text-warning">Email is already in use, please choose another.</p>
            }
            <button onClick={handleSubmit} type="submit" className="btn btn-primary m-3">Sign Up</button>
        </div>
    );
};

