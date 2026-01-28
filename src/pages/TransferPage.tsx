import { useState } from "react";
import { transfer } from "../services/walletService";
import { Link, useNavigate } from "react-router-dom";
import { Send, User, DollarSign, Loader2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

export default function TransferPage() {
    const [amount, setAmount] = useState<number | string>('');
    const [toEmail, setToEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleTransfer = async () => {
        if (!toEmail || !amount || Number(amount) <= 0) return;
        
        setLoading(true);
        setError('');
        try {
            const response = await transfer(toEmail, Number(amount));
            // Check if response contains transactionId. 
            // walletService returns response.data, and now backend returns map with transactionId.
            if (response && response.transactionId) {
                navigate(`/transaction/${response.transactionId}`);
            } else {
                 // Fallback if ID invalid, though backend guarantees it.
                 setSuccess(true);
            }
        } catch (err: any) {
            // Parse specific error messages from API response
            const errorMessage = err?.response?.data?.message || err?.response?.data?.error || '';
            const errorCode = err?.response?.status;
            
            if (errorCode === 404 || errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('user')) {
                setError('Recipient not found. Please check the email address.');
            } else if (errorCode === 400 && (errorMessage.toLowerCase().includes('insufficient') || errorMessage.toLowerCase().includes('balance'))) {
                setError('Insufficient balance. Please top up your wallet first.');
            } else if (errorMessage) {
                setError(errorMessage);
            } else {
                setError('Transfer failed. Please try again later.');
            }
        }
        setLoading(false);
    }

    return (
        <div className="max-w-xl mx-auto p-4 pt-10">
        <Link to="/" className="glass-card p-4 mb-6 flex items-center gap-2 text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
        </Link>

            <div className="glass-card p-8">
                    <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-accent/20 rounded-xl">
                        <Send className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Transfer Funds</h2>
                        <p className="text-white/40 text-sm">Send to friends and family instantly</p>
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
                            className="input-field pl-14"
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
                            className="input-field pl-14 text-xl font-bold"
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
                            Request Sent
                        </>
                    ) : (
                        <>
                            Send Now
                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                {success && <p className="text-white/60 text-sm text-center mt-4">Processing... You will be notified shortly.</p>}
            </div>
        </div>
    )
}