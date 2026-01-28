import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"

function Login(){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("");
    const navigate = useNavigate()
    const authContext = useAuthContext();

    const handleLogin = async (e: React.FormEvent) => {
        // stops the browser’s default behavior (reload)
        e.preventDefault();
        try{
            const response = await authContext.login(username, password);
            console.log(response);
            navigate("/");
        }catch(error){
            setError("Invalid credentials");
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                        Mini TNG
                    </h1>
                    <p className="text-gray-400">Welcome back! Please login to your account.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <input 
                            className="input-field"
                            type="text"
                            placeholder="name@example.com"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <input 
                            className="input-field"
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    
                    <button type="submit" className="btn-primary">
                        Login Now
                    </button>
                    
                    {error &&
                        <div className="p-3 rounded bg-red-500/10 border border-red-500/50 text-red-200 text-sm text-center">
                            {error}
                        </div>
                    }
                </form>

                <div className="text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login