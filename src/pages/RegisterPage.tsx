import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent): Promise<boolean> => {
        e.preventDefault();
        try{
            if(password !== confirmPassword){
                setError("Passwords do not match");
                return false;
            }
            const response = await register(email, name, password);
            console.log(response);
            // pass email to otp page
            navigate('/verify-otp', { state: { email } });
            return true;
        }catch(error){
            console.log(error);
            setError("Registration failed. Please try again.");
            return false;
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400">Join Mini TNG today</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                        <input 
                            className="input-field"
                            type="text" 
                            placeholder="John Doe" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <input 
                            className="input-field"
                            type="email" 
                            placeholder="name@example.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <input 
                            className="input-field"
                            type="password" 
                            placeholder="Create a password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
                        <input
                            className="input-field"
                            type="password"
                            placeholder="Repeat password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-primary mt-4">
                        Register
                    </button>

                    {error && 
                        <div className="p-3 rounded bg-red-500/10 border border-red-500/50 text-red-200 text-sm text-center">
                            {error}
                        </div>
                    }
                </form>

                <div className="text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link to="/" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    )
}