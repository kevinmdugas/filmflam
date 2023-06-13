import { useAuth } from "@/services/Auth.tsx";
import { Navigate } from "react-router-dom";
import { User } from "@/types.js";

export const ProtectedRoute = ({ children }: any) => {
	const auth = useAuth();
	let user: User | null = null;

	if (auth) {
		user = auth.user;
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return children;
};
