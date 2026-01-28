import { useEffect, useState } from "react";
import { getTransactionHistory } from "../services/transactionService";
import { getBalance } from "../services/walletService";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Send, Search } from "lucide-react";
import type { Transaction } from "../services/transactionService";

export default function TransactionHistoryPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [walletId, setWalletId] = useState<string>('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [balanceData, historyData] = await Promise.all([
                    getBalance(),
                    getTransactionHistory()
                ]);
                setWalletId(balanceData.walletId);
                setTransactions(historyData);
                setFilteredTransactions(historyData);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (!search) {
            setFilteredTransactions(transactions);
            return;
        }
        const lowerSearch = search.toLowerCase();
        const filtered = transactions.filter(tx => 
            tx.transactionId.toLowerCase().includes(lowerSearch) ||
            tx.status.toLowerCase().includes(lowerSearch) ||
            tx.amount.toString().includes(lowerSearch)
        );
        setFilteredTransactions(filtered);
    }, [search, transactions]);

    const isIncoming = (tx: Transaction) => {
        if (tx.fromWalletId === 'SYSTEM') return true;
        if (tx.toWalletId === walletId) return true;
        return false;
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/" className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Transaction History</h1>
                </div>

                <div className="glass-card p-6 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search transactions..." 
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="glass-card p-6">
                    {loading ? (
                        <div className="text-center text-white/40 py-8">Loading transactions...</div>
                    ) : (
                        <div className="space-y-4">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((tx) => {
                                    const incoming = isIncoming(tx);
                                    return (
                                        <Link to={`/transaction/${tx.transactionId}`} key={tx.transactionId} className="flex justify-between items-center p-4 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-white/10">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl ${incoming ? 'bg-green-500/20' : 'bg-red-500/20'} group-hover:scale-110 transition-transform`}>
                                                    {incoming ? (
                                                        <ArrowUpRight className="w-6 h-6 text-green-400" />
                                                    ) : (
                                                        <Send className="w-6 h-6 text-red-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-lg">
                                                        {tx.fromWalletId === 'SYSTEM' ? 'Top Up' : incoming ? 'Received' : 'Transfer Out'}
                                                    </p>
                                                    <p className="text-white/40 text-sm">
                                                        {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold text-lg ${incoming ? 'text-green-400' : 'text-white'}`}>
                                                    {incoming ? '+' : '-'}${tx.amount.toLocaleString()}
                                                </p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    tx.status === 'SUCCESS' ? 'bg-green-500/10 text-green-400' : 
                                                    tx.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                                                }`}>
                                                    {tx.status}
                                                </span>
                                            </div>
                                        </Link>
                                    )
                                })
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-white/20" />
                                    </div>
                                    <p className="text-white/40">No transactions found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
