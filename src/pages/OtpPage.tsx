import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp, resendOtp } from "../services/authService";

export default function OtpPage() {
    const [otpCode, setOtpCode] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    // Default to empty string or handle undefined state safely
    const email = location.state?.email || '';

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const response = await verifyOtp(email, otpCode);
            console.log(response);
            navigate('/');
        }catch(error){
            console.log(error);
            setError("Invalid Code. Please try again.");
        }
    }

    const handleResendOtp = async () => {
        try{
            setMessage("");
            await resendOtp(email);
            setMessage("OTP resent successfully check email.");
        }catch(error){
            console.log(error);
            setError("Failed to resend OTP");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-sm p-8 space-y-6 text-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Verify OTP</h1>
                    <p className="text-gray-400 text-sm">
                        Enter the code sent to <br/>
                        <span className="text-white font-medium">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div>
                        <input 
                            className="input-field text-center text-2xl tracking-[0.5em] font-mono"
                            type="text" 
                            placeholder="000000"
                            maxLength={6}
                            value={otpCode} 
                            onChange={(e) => setOtpCode(e.target.value)} 
                        />
                    </div>
                    
                    <button type="submit" className="btn-primary">
                        Verify Account
                    </button>

                    {error && 
                        <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded border border-red-500/20">
                            {error}
                        </div>
                    }
                     {message && 
                        <div className="text-green-400 text-sm bg-green-500/10 p-2 rounded border border-green-500/20">
                            {message}
                        </div>
                    }
                </form>

                <div>
                     <button 
                        onClick={handleResendOtp}
                        className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium hover:underline"
                    >
                        Resend OTP Code
                    </button>
                </div>
            </div>
        </div>
    )
}