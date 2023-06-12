import {createContext, useContext, useState} from 'react';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut } from 'firebase/auth';
import {useNavigate} from "react-router-dom";
// import firebase from "firebase/compat";
// import User = firebase.User;

// Firebase tutorial I followed: https://www.youtube.com/watch?v=rbuSx1yEgV8

export const AuthContext = createContext<AuthContextProps | null>(null);

export type AuthContextProps = {
    userId: number | null;
    login: (email: string, password: string) => Promise<boolean>;
    createAccount: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const firebaseConfig = {
    apiKey: import.meta.env.API_KEY,
    authDomain: "filmflam-de495.firebaseapp.com",
    projectId: "filmflam-de495",
    storageBucket: "filmflam-de495.appspot.com",
    messagingSenderId: "977009956203",
    appId: "1:977009956203:web:da28127f8101fb8642a82e"
};

export const AuthProvider = ({ children }: any) => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<number | null>(null);
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const login = async (email: string, password: string) => {
        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential.user)
            // setUserId(userCredential.user)
            navigate("/");
            return true
        } catch (err) {
            console.error(err);
            navigate("/login");
            return false;
        }
    }

    const createAccount = async (email: string, password: string) => {
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log(userCredential.user)
            navigate("/")
            return true;
        } catch (err) {
            console.error(err);
            navigate("/signup")
            return false;
        }
    }

    const logout = async () => {
        await signOut(auth)
        navigate("/");
    }

    return (
        <AuthContext.Provider
            value={{
                userId,
                login,
                createAccount,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}

