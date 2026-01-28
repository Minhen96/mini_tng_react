import { useState } from "react";
import { transfer } from "../services/walletService";
import { Link } from "react-router-dom";
import { Send, User, DollarSign, Loader2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

export default function TransferPage() {
    const [amount, setAmount] = useState<number | string>('');
    const [toEmail, setToEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleTransfer = async () => {
        if (!toEmail || !amount || Number(amount) <= 0) return;
        
        setLoading(true);
        setError('');
        try {
            const response = await transfer(toEmail, Number(amount));
            if (response) {
                setSuccess(true);
                setAmount('');
                setToEmail('');
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            setError("Transfer failed. Please check balance and recipient email.");
        }
        setLoading(false);
    }

    return (
        <div className="max-w-xl mx-auto p-4 pt-10">
             <Link to="/" className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
            </Link>

            <div className="glass-card p-8">
                    <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Send className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Transfer Funds</h2>
                        <p className="text-white/60 text-sm">Send to friends and family instantly</p>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-white/60 text-sm font-medium mb-2">Recipient Email</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                        <input 
                            type="email" 
                            value={toEmail} 
                            onChange={(e) => setToEmail(e.target.value)} 
                            className="input-field pl-12"
                            placeholder="john.doe@example.com"
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-white/60 text-sm font-medium mb-2">Amount</label>
                        <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            className="input-field pl-12 text-xl font-bold"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 mb-6 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <button 
                    onClick={handleTransfer} 
                    disabled={loading || !toEmail || !amount}
                    className="btn-primary flex justify-center items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                        {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : success ? (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            Sent!
                        </>
                    ) : (
                        <>
                            Send Now
                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                {success && <p className="text-green-400 text-sm text-center mt-4">Transfer successful!</p>}
            </div>
        </div>
    )
}