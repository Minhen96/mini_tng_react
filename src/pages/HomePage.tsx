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
        if (tx.fromWalletId === 'SYSTEM') return true;
        // If I am the receiver (toWallet == myWallet), it is incoming
        if (tx.toWalletId === walletId) return true;
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
            <div className="glass-card p-8 mb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
                    <Wallet className="w-48 h-48 text-white" />
                </div>
                
                <div className="relative z-10">
                    <p className="text-blue-200 text-sm font-medium mb-2 uppercase tracking-wider">Total Balance</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-white tracking-tight">
                            {loading ? "..." : `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                        </span>
                        <span className="text-white/60 text-lg">USD</span>
                    </div>
                </div>
                
                <div className="mt-8 flex gap-4">
                     <Link to="/top-up" className="btn-primary flex items-center gap-2 w-auto! px-6">
                        <PlusCircle className="w-5 h-5" />
                        Top Up
                    </Link>
                    <Link to="/transfer" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2">
                         <Send className="w-5 h-5" />
                        Transfer
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                     <Link to="/transaction-history" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
                </div>
               
                <div className="space-y-4">
                    {transactionHistory && transactionHistory.length > 0 ? (
                        transactionHistory.slice(0, 5).map((tx) => {
                            const incoming = isIncoming(tx);
                            return (
                                <Link to={`/transaction/${tx.transactionId}`} key={tx.transactionId} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer block">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${incoming ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                            {incoming ? (
                                                <ArrowUpRight className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <Send className="w-5 h-5 text-red-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">
                                                {tx.fromWalletId === 'SYSTEM' ? 'Top Up' : incoming ? 'Received' : 'Transfer Out'}
                                            </p>
                                            <p className="text-white/40 text-xs">
                                                {/* Fix Date Rendering safely */}
                                                {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`font-bold ${incoming ? 'text-green-400' : 'text-white'}`}>
                                        {incoming ? '+' : '-'}${tx.amount.toLocaleString()}
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