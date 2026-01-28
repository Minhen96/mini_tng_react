import { useEffect, useState } from "react";
import { getBalance } from "../services/walletService";
import { getTransactionHistory } from "../services/transactionService";
import { Link } from "react-router-dom";
import { Wallet, PlusCircle, Send, ArrowUpRight, LogOut } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import type { Transaction } from "../services/transactionService";

export default function HomePage() {

    const [balance, setBalance] = useState(0);
    const [walletId, setWalletId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const { user, logout } = useAuthContext();
    const [transactionHistory, setTransactionHistory] = useState<Transaction[]>();

    useEffect(() => {
        const fetchBalance = async () => {
            setLoading(true);
            try {
                const response = await getBalance();
                setBalance(response.balance);
                setWalletId(response.walletId);
            } catch (error) {
                console.error("Failed to fetch balance", error);
            }
            setLoading(false);
        }
        fetchBalance();

        const fetchTransactionHistory = async () => {
            setLoading(true);
            try {
                const response = await getTransactionHistory();
                setTransactionHistory(response);
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            }
            setLoading(false);
        }
        fetchTransactionHistory();
    }, []);

    const isIncoming = (tx: Transaction) => {
        if (tx.fromUserId === 'SYSTEM') return true;
        // If I am the receiver (toUser == myWallet), it is incoming
        if (tx.toUserId === walletId) return true;
        return false;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Welcome, {user?.name}</h1>
                    <p className="text-white/60 text-sm">{user?.email}</p>
                </div>
                <button 
                    onClick={() => logout()}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </header>

            {/* Balance Card */}
            <div className="glass-card p-6 sm:p-8 mb-6 sm:mb-8 relative overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-white/2 to-transparent pointer-events-none"></div>
                
                {/* Corner accents - visible on all sizes for premium feel */}
                <div className="absolute top-0 left-0 w-8 sm:w-12 h-8 sm:h-12 border-l border-t border-accent/40 rounded-tl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-8 sm:w-12 h-8 sm:h-12 border-r border-b border-accent/40 rounded-br-2xl"></div>
                
                {/* Wallet icon - hidden on mobile */}
                <div className="hidden sm:block absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Wallet className="w-32 h-32 text-white" />
                </div>
                
                <div className="relative z-10 text-center sm:text-left">
                    <p className="text-white/40 text-[10px] sm:text-xs font-medium mb-3 uppercase tracking-[0.2em]">Balance</p>
                    <div className="flex items-baseline justify-center sm:justify-start gap-1">
                        <span className="text-white/40 text-xl sm:text-2xl font-light">$</span>
                        <span className="text-4xl sm:text-5xl font-light text-white tracking-tight">
                            {loading ? "..." : balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="mt-1 flex items-center justify-center sm:justify-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
                        <span className="text-white/30 text-[10px] sm:text-xs uppercase tracking-wider">Active</span>
                    </div>
                </div>
                
                <div className="mt-6 sm:mt-8 flex gap-3">
                    <Link to="/top-up" className="flex-1 sm:flex-none btn-primary flex items-center justify-center gap-2 px-6">
                        <PlusCircle className="w-4 h-4" />
                        <span>Top Up</span>
                    </Link>
                    <Link to="/transfer" className="flex-1 sm:flex-none bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        <span>Transfer</span>
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-4 sm:p-6">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                     <h3 className="text-base sm:text-lg font-bold text-white">Recent Transactions</h3>
                     <Link to="/transaction-history" className="text-xs sm:text-sm text-accent hover:text-accent/80 transition-colors">View All</Link>
                </div>
               
                <div className="space-y-2 sm:space-y-3">
                    {transactionHistory && transactionHistory.length > 0 ? (
                        transactionHistory.slice(0, 5).map((tx) => {
                            const incoming = isIncoming(tx);
                            const isTopUp = tx.fromUserId === 'SYSTEM';
                            
                            // Determine colors based on transaction type
                            // Top Up = blue (accent), Transfer In = green, Transfer Out = red
                            const iconBg = isTopUp ? 'bg-accent/20' : incoming ? 'bg-emerald-500/20' : 'bg-red-500/20';
                            const iconColor = isTopUp ? 'text-accent' : incoming ? 'text-emerald-400' : 'text-red-400';
                            const amountColor = isTopUp ? 'text-accent' : incoming ? 'text-emerald-400' : 'text-red-400';
                            
                            return (
                                <Link to={`/transaction/${tx.transactionId}`} key={tx.transactionId} className="flex justify-between items-center p-3 sm:p-4 hover:bg-white/5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-white/10 group">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 sm:p-2.5 rounded-xl ${iconBg} group-hover:scale-110 transition-transform`}>
                                            {isTopUp ? (
                                                <PlusCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
                                            ) : incoming ? (
                                                <ArrowUpRight className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
                                            ) : (
                                                <Send className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm sm:text-base">
                                                {isTopUp ? 'Top Up' : incoming ? 'Received' : 'Transfer Out'}
                                            </p>
                                            <p className="text-white/40 text-[10px] sm:text-xs">
                                                {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`font-bold text-sm sm:text-base ${amountColor}`}>
                                        {incoming || isTopUp ? '+' : '-'}${tx.amount.toLocaleString()}
                                    </span>
                                </Link>
                            )
                        })
                    ) : (
                        <p className="text-white/40 text-center py-4">No recent activity</p>
                    )}
                </div>
            </div>

        </div>
    )
}