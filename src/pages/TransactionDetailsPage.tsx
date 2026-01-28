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
        <div className="min-h-screen p-6 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/transaction-history" className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-xl font-bold text-white">Transaction Details</h1>
                </div>

                <div className="glass-card overflow-hidden">
                    <div className="p-8 text-center border-b border-white/10 bg-white/5">
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${incoming ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                             {incoming ? (
                                <ArrowUpRight className={`w-10 h-10 ${incoming ? 'text-green-400' : 'text-red-400'}`} />
                            ) : (
                                <Send className={`w-10 h-10 ${incoming ? 'text-green-400' : 'text-red-400'}`} />
                            )}
                        </div>
                        <p className={`text-3xl font-bold mb-1 ${incoming ? 'text-green-400' : 'text-white'}`}>
                            {incoming ? '+' : '-'}${transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-white/60 text-sm">{transaction.fromUserId === 'SYSTEM' ? 'Top Up Success' : incoming ? 'Payment Received' : 'Transfer Sent'}</p>
                        
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mt-4 ${
                            transaction.status === 'SUCCESS' ? 'bg-green-500/10 text-green-400' : 
                            transaction.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                            {transaction.status === 'SUCCESS' ? <CheckCircle className="w-3 h-3" /> : 
                             transaction.status === 'PENDING' ? <Clock className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {transaction.status}
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-1">
                            <p className="text-white/40 text-xs uppercase tracking-wider">Transaction ID</p>
                            <div className="flex items-center justify-between group">
                                <p className="text-white font-mono text-sm break-all">{transaction.transactionId}</p>
                                <button className="text-white/40 hover:text-white transition-colors" title="Copy ID">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-white/40 text-xs uppercase tracking-wider">Date</p>
                                <p className="text-white text-sm">
                                    {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                             <div className="space-y-1">
                                <p className="text-white/40 text-xs uppercase tracking-wider">Time</p>
                                <p className="text-white text-sm">
                                    {transaction.createdAt ? new Date(transaction.createdAt).toLocaleTimeString() : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-white/40 text-xs uppercase tracking-wider">From Wallet</p>
                            <p className="text-white text-sm break-all font-mono bg-white/5 p-2 rounded">
                                {transaction.fromUserId}
                            </p>
                        </div>
                         <div className="space-y-1">
                            <p className="text-white/40 text-xs uppercase tracking-wider">To Wallet</p>
                            <p className="text-white text-sm break-all font-mono bg-white/5 p-2 rounded">
                                {transaction.toUserId}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
