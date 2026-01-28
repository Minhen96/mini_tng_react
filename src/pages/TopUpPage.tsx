import { useState } from "react";
import { topUp } from "../services/walletService";
import { Link } from "react-router-dom";
import { CreditCard, DollarSign, CheckCircle, Loader2, ArrowLeft } from "lucide-react";

export default function TopUpPage() {
    const [amount, setAmount] = useState<number | string>('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleTopup = async () => {
        if (!amount || Number(amount) <= 0) return;
        
        setLoading(true);
        const response = await topUp(Number(amount));
        if (response) {
            setSuccess(true);
            setAmount('');
            setTimeout(() => setSuccess(false), 3000);
        }
        setLoading(false);
    }

    const quickAmounts = [10, 50, 100, 200, 500];

    return (
        <div className="max-w-xl mx-auto p-4 pt-10">
            <Link to="/" className="glass-card p-4 mb-6 flex items-center gap-2 text-white/50 hover:text-white hover:bg-white/5 transition-all">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Dashboard</span>
            </Link>

                <div className="glass-card p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-accent/20 rounded-xl">
                            <CreditCard className="w-8 h-8 text-accent" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Add Funds</h2>
                            <p className="text-white/40 text-sm">Use your linked card or bank</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-white/60 text-sm font-medium mb-2">Enter Amount</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)} 
                                className="input-field pl-14 text-2xl font-bold"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-white/60 text-sm font-medium mb-3">Quick Select</label>
                        <div className="flex flex-wrap gap-3">
                            {quickAmounts.map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => setAmount(amt)}
                                    className={`px-4 py-2 rounded-lg border transition-all duration-200 font-medium ${
                                        Number(amount) === amt
                                        ? "bg-white border-white text-black"
                                        : "bg-white/5 border-mono-border text-white/70 hover:bg-white/10 hover:border-white/20"
                                    }`}
                                >
                                    ${amt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleTopup} 
                        disabled={loading || !amount}
                        className="btn-primary flex justify-center items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : success ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Success!
                            </>
                        ) : (
                            <>
                                Confirm Payment
                            </>
                        )}
                    </button>
                    
                    {success && <p className="text-white/60 text-sm text-center mt-4">Funds added successfully!</p>}
                </div>
                
                <p className="text-center text-white/40 text-xs mt-6">
                    Secure 256-bit encrypted transaction. Payments are processed immediately in simulation mode.
                </p>
            </div>
    )
}   