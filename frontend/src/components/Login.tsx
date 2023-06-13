import {useAuth} from "@/services/Auth.tsx";
import {useState} from "react";

export const LoginPage = () => {
    const auth = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [authFail, setAuthFail] = useState(false);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const success = await auth?.login(formData.email, formData.password);
        if (success) {
            console.log("Login successful")
            setAuthFail(false);
        } else {
            console.log("Login unsuccessful")
            setAuthFail(true);
        }
    };

   return (
       <div className="container rounded m-5 bg-body-secondary">
           <h2 className="text-title fs-1 fw-bold fst-italic mb-3 pt-3">Log In</h2>
           <div className="mb-3">
               <label htmlFor="email" className="form-label text-primary mt-2">
                   Email Address
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
               <label htmlFor="password" className="form-label text-primary">
                   Password
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
           {authFail &&
               <p className="text-warning">Failed to log in. Give it another go, pal.</p>
           }
           <button onClick={handleSubmit} type="submit" className="btn btn-primary m-3">Log In</button>
       </div>
   )
}