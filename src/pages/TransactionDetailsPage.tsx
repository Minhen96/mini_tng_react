import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTransactionDetails } from "../services/transactionService";
import { getBalance } from "../services/walletService";
import { ArrowLeft, CheckCircle, XCircle, Clock, Copy, ArrowUpRight, Send } from "lucide-react";
import type { Transaction } from "../services/transactionService";

export default function TransactionDetailsPage() {
    const { transactionId } = useParams();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [walletId, setWalletId] = useState<string>('');

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (!transaction) setLoading(true); 
            
            try {
                if (transactionId) {
                    const [balanceData, txData] = await Promise.all([
                        getBalance(),
                        getTransactionDetails(transactionId)
                    ]);
                    
                    if (isMounted) {
                        setWalletId(balanceData.walletId);
                        setTransaction(txData);
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch details", error);
                if (isMounted) setLoading(false);
            }
        }
        
        fetchData();

        // Listen for real-time SSE updates
        const handleUpdate = () => {
            console.log("⚡ Real-time update received!");
            fetchData();
        };

        window.addEventListener('TRANSACTION_UPDATED', handleUpdate);
        
        return () => { 
            isMounted = false;
            window.removeEventListener('TRANSACTION_UPDATED', handleUpdate);
        };
    }, [transactionId, transaction?.status]);

    const isIncoming = (tx: Transaction) => {
        if (tx.fromUserId === 'SYSTEM') return true;
        if (tx.toUserId === walletId) return true;
        return false;
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading details...</div>;
    if (!transaction) return <div className="min-h-screen flex items-center justify-center text-white">Transaction not found</div>;

    const incoming = isIncoming(transaction);

    return (
        <div className="min-h-screen p-4 sm:p-6 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="flex items-center gap-4 mb-4 sm:mb-6">
                    <Link to="/" className="p-2.5 rounded-xl bg-white/5 hover:bg-accent/20 text-white/50 hover:text-accent transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-white via-accent to-white bg-clip-text text-transparent">Transaction Details</h1>
                </div>

                <div className="glass-card overflow-hidden relative">
                    {/* Corner accents - hidden on mobile */}
                    <div className="hidden sm:block absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-accent/30 rounded-tl-2xl pointer-events-none z-10"></div>
                    <div className="hidden sm:block absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-accent/30 rounded-br-2xl pointer-events-none z-10"></div>
                    
                    {/* Amount Section */}
                    <div className="p-5 sm:p-8 text-center border-b border-accent/10 bg-linear-to-b from-accent/5 to-transparent">
                        <div className={`w-14 h-14 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center mb-3 sm:mb-4 ${incoming ? 'bg-accent/20 shadow-[0_0_30px_rgba(74,158,255,0.2)]' : 'bg-white/5'}`}>
                             {incoming ? (
                                <ArrowUpRight className="w-7 h-7 sm:w-10 sm:h-10 text-accent" />
                            ) : (
                                <Send className="w-7 h-7 sm:w-10 sm:h-10 text-white/50" />
                            )}
                        </div>
                        <p className="text-3xl sm:text-5xl font-bold tracking-tight mb-2 text-white drop-shadow-[0_0_30px_rgba(74,158,255,0.15)]">
                            {incoming ? '+' : '-'}${transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-white/40 text-sm uppercase tracking-wider">
                            {transaction.fromUserId === 'SYSTEM' ? 'Top Up' : incoming ? 'Received' : 'Sent'}
                        </p>
                        
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mt-6 ${
                            transaction.status === 'SUCCESS' ? 'bg-accent/10 text-accent' : 
                            transaction.status === 'PENDING' ? 'bg-white/5 text-white/60' : 'bg-white/5 text-white/40'
                        }`}>
                            {transaction.status === 'SUCCESS' ? <CheckCircle className="w-3 h-3" /> : 
                             transaction.status === 'PENDING' ? <Clock className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {transaction.status}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-6 space-y-5">
                        <div className="flex justify-between items-center py-3 border-b border-mono-border">
                            <span className="text-white/40 text-sm">Date</span>
                            <span className="text-white text-sm">
                                {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-mono-border">
                            <span className="text-white/40 text-sm">Time</span>
                            <span className="text-white text-sm">
                                {transaction.createdAt ? new Date(transaction.createdAt).toLocaleTimeString() : 'N/A'}
                            </span>
                        </div>
                        <div className="py-3 border-b border-mono-border">
                            <p className="text-white/40 text-sm mb-2">Transaction ID</p>
                            <div className="flex items-center justify-between">
                                <p className="text-white font-mono text-xs break-all">{transaction.transactionId}</p>
                                <button className="text-white/30 hover:text-white transition-colors ml-2" title="Copy ID">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="py-3 border-b border-mono-border">
                            <p className="text-white/40 text-sm mb-2">From</p>
                            <p className="text-white text-sm font-mono break-all">{transaction.fromUserId}</p>
                        </div>
                        <div className="py-3">
                            <p className="text-white/40 text-sm mb-2">To</p>
                            <p className="text-white text-sm font-mono break-all">{transaction.toUserId}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
