import { useAuth } from "@/services/Auth.tsx";

export const ProfilePage = () => {
	const auth = useAuth();
	if (!auth || !auth.user) {
		return <h1>INTRUDER ALERT! HALT, HACKER! I'M CALLING THE POLICE!</h1>;
	}
	return (
		<div className="container">
			<h1 className="text-title fs-1 fw-bold fst-italic mt-5 pt-3">
				{auth.user.name}'s Shame Chamber
			</h1>
			<small>Keeping track of your web of lies so you don't have to.</small>

			<div className="py-3 mt-3 card bg-body-secondary">
				<div className="card-body">
					<h5 className="card-title text-primary">Personal Information</h5>
					<p className="card-text">
						<strong>Name:</strong> {auth.user.name}
					</p>
					<p className="card-text">
						<strong>Email:</strong> {auth.user.email}
					</p>
				</div>
			</div>

			<div className="card mt-3 py-3 bg-body-secondary">
				<div className="card-body">
					<h5 className="card-title text-primary">Favorites</h5>
					<p className="card-text">
						<strong>Favorite Film:</strong> {auth.user.favFilm}
					</p>
					<p className="card-text">
						<strong>Favorite Actor:</strong> {auth.user.favActor}
					</p>
					<p className="card-text">
						<strong>Favorite TV Show:</strong> {auth.user.favTVShow}
					</p>
				</div>
			</div>

			<div className="card mt-3 bg-body-secondary">
				<div className="card-body">
					<h5 className="card-title text-primary">Reviews</h5>
					{!auth.user.reviews || auth.user.reviews.length === 0 ? (
						<p className="card-text">No reviews yet.</p>
					) : (
						<ul className="list-group">
							{auth.user.reviews &&
								auth.user.reviews.map((review, index) => (
									<li className="list-group-item" key={index}>
										{review}
									</li>
								))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};
