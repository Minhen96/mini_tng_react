import { useEffect, useState, useRef } from "react";
import { getTransactionHistory } from "../services/transactionService";
import { getBalance } from "../services/walletService";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Send, Search, PlusCircle } from "lucide-react";
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Transaction } from "../services/transactionService";

export default function TransactionHistoryPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [walletId, setWalletId] = useState<string>('');
    const [search, setSearch] = useState('');

    const parentRef = useRef<HTMLDivElement>(null);

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
        if (tx.fromUserId === 'SYSTEM') return true;
        if (tx.toUserId === walletId) return true;
        return false;
    }

    const rowVirtualizer = useVirtualizer({
        count: filteredTransactions.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 90, // Estimated row height
        overscan: 5,
    });

    return (
        <div className="min-h-screen p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-4 sm:mb-6">
                    <Link to="/" className="p-2.5 rounded-xl bg-white/5 hover:bg-accent/20 text-white/50 hover:text-accent transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl sm:text-3xl font-bold bg-linear-to-r from-white via-accent to-white bg-clip-text text-transparent">Transaction History</h1>
                </div>

                <div className="glass-card p-6 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search transactions..." 
                            className="w-full bg-white/5 border border-mono-border rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-accent/50 focus:shadow-subtle-focus transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="glass-card p-4 sm:p-6 h-[500px] sm:h-[600px] flex flex-col relative">
                    {/* Corner accents - hidden on mobile */}
                    <div className="hidden sm:block absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-accent/30 rounded-tl-2xl pointer-events-none"></div>
                    <div className="hidden sm:block absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-accent/30 rounded-br-2xl pointer-events-none"></div>
                    {loading ? (
                        <div className="text-center text-white/40 py-8">Loading transactions...</div>
                    ) : filteredTransactions.length > 0 ? (
                        <div 
                            ref={parentRef} 
                            className="flex-1 overflow-y-auto"
                            style={{ contain: 'strict' }}
                        >
                            <div
                                style={{
                                    height: `${rowVirtualizer.getTotalSize()}px`,
                                    width: '100%',
                                    position: 'relative',
                                }}
                            >
                                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                                    const tx = filteredTransactions[virtualItem.index];
                                    const incoming = isIncoming(tx);
                                    const isTopUp = tx.fromUserId === 'SYSTEM';
                                    
                                    // Determine colors based on transaction type
                                    // Top Up = blue (accent), Transfer In = green, Transfer Out = red
                                    const iconBg = isTopUp ? 'bg-accent/20' : incoming ? 'bg-emerald-500/20' : 'bg-red-500/20';
                                    const iconColor = isTopUp ? 'text-accent' : incoming ? 'text-emerald-400' : 'text-red-400';
                                    const amountColor = isTopUp ? 'text-accent' : incoming ? 'text-emerald-400' : 'text-red-400';
                                    const statusBg = isTopUp ? 'bg-accent/10 text-accent' : 
                                                     tx.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 
                                                     tx.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-white/5 text-white/40';
                                    
                                    return (
                                        <div
                                            key={virtualItem.key}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: `${virtualItem.size}px`,
                                                transform: `translateY(${virtualItem.start}px)`,
                                            }}
                                            className="px-1 sm:px-2 py-1"
                                        >
                                            <Link 
                                                to={`/transaction/${tx.transactionId}`} 
                                                className="flex justify-between items-center p-3 sm:p-4 hover:bg-white/5 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-white/10 h-full"
                                            >
                                                <div className="flex items-center gap-3 sm:gap-4">
                                                    <div className={`p-2.5 sm:p-3 rounded-xl ${iconBg} group-hover:scale-110 transition-transform`}>
                                                        {isTopUp ? (
                                                            <PlusCircle className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
                                                        ) : incoming ? (
                                                            <ArrowUpRight className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
                                                        ) : (
                                                            <Send className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold text-base sm:text-lg">
                                                            {isTopUp ? 'Top Up' : incoming ? 'Received' : 'Transfer Out'}
                                                        </p>
                                                        <p className="text-white/40 text-xs sm:text-sm">
                                                            {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-bold text-base sm:text-lg ${amountColor}`}>
                                                        {incoming || isTopUp ? '+' : '-'}${tx.amount.toLocaleString()}
                                                    </p>
                                                    {tx.status !== 'SUCCESS' && (
                                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                                            tx.status === 'PENDING' || tx.status === 'FROZEN' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                                                        }`}>
                                                            {tx.status === 'FROZEN' ? 'PENDING' : tx.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-white/20" />
                            </div>
                            <p className="text-white/40">No transactions found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
