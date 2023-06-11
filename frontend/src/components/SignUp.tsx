import { useState } from 'react';

export const SignUpPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        favActor: '',
        favFilm: '',
        favTVShow: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="container rounded m-5 bg-body-secondary">
            <h2 className="text-title fs-1 fw-bold fst-italic m-3">Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label text-primary mt-2">
                        Email Address<span className="text-danger">*</span>
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="vdeezbabyyy@family4lyf3.com"
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
                        placeholder="Vin Diesel"
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
                        placeholder="vrooom123"
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
                        id="favoriteActor"
                        name="favoriteActor"
                        placeholder="Vin Diesel"
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
                        id="favoriteFilm"
                        name="favoriteFilm"
                        placeholder="Dragonball Evolution"
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
                        id="favoriteTVShow"
                        name="favoriteTVShow"
                        placeholder="The Joy of Painting"
                        value={formData.favTVShow}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary m-3">Sign Up</button>
            </form>
        </div>
    );
};

