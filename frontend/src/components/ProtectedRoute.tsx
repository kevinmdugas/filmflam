import { useAuth } from "@/services/Auth.tsx";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({children}: any) => {
    const auth = useAuth();
    let userId: number | null = null

    if (auth) {
        userId = auth.userId;
    }

    if (!userId) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
