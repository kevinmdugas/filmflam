import { createContext, useContext, useState } from "react";
import { initializeApp } from "firebase/app";
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { User } from "../types.js";
import { UserService } from "@/services/UserService.tsx";

// Firebase tutorial I followed: https://www.youtube.com/watch?v=rbuSx1yEgV8

export const AuthContext = createContext<AuthContextProps | null>(null);

export type AuthContextProps = {
	user: User | null;
	login: (email: string, password: string) => Promise<boolean>;
	createAccount: (theUser: User) => Promise<boolean>;
	logout: () => Promise<void>;
};

const firebaseConfig = {
	apiKey: import.meta.env.API_KEY,
	authDomain: "filmflam-de495.firebaseapp.com",
	projectId: "filmflam-de495",
	storageBucket: "filmflam-de495.appspot.com",
	messagingSenderId: "977009956203",
	appId: "1:977009956203:web:da28127f8101fb8642a82e",
};

export const AuthProvider = ({ children }: any) => {
	const navigate = useNavigate();
	const [user, setUser] = useState<User | null>(null);
	const app = initializeApp(firebaseConfig);
	const auth = getAuth(app);

	const login = async (email: string, password: string) => {
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const theUser = await UserService.fetchUser(userCredential.user.uid);
			setUser(theUser);
			navigate("/");
			return true;
		} catch (err) {
			console.error(err);
			navigate("/login");
			return false;
		}
	};

	const createAccount = async (theUser: User) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				theUser.email,
				theUser.password
			);
			theUser.loginUID = userCredential.user.uid;
			await UserService.createUser(theUser);
			setUser(theUser);
			navigate("/");
			return true;
		} catch (err) {
			console.error(err);
			navigate("/signup");
			return false;
		}
	};

	const logout = async () => {
		setUser(null);
		await signOut(auth);
		navigate("/");
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				createAccount,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
