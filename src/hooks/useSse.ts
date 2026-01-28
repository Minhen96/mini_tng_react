import { useEffect } from 'react';
import toast from 'react-hot-toast';

export const useSse = (userId: string | undefined) => {
    useEffect(() => {
        if (!userId) return;

        console.log(`🔌 Connecting to SSE for user: ${userId}`);
        const eventSource = new EventSource(`http://localhost:8088/api/v1/sse/subscribe/${userId}`, { withCredentials: true });

        eventSource.onopen = () => {
            console.log("✅ SSE Connected");
        };

        eventSource.onerror = (error) => {
            console.error("❌ SSE Error:", error);
            eventSource.close();
        };

        eventSource.addEventListener("TRANSFER_SUCCESS", (event) => {
            console.log("💰 Transfer Success:", event.data);
            toast.success(event.data, {
                duration: 5000,
                position: 'top-right',
            });
            // Broadcast event for active pages
            window.dispatchEvent(new CustomEvent('TRANSACTION_UPDATED'));
        });

        eventSource.addEventListener("TRANSFER_FAILED", (event) => {
            console.error("❌ Transfer Failed:", event.data);
            toast.error(event.data, {
                duration: 5000,
                position: 'top-right',
            });
            window.dispatchEvent(new CustomEvent('TRANSACTION_UPDATED'));
        });

        return () => {
            console.log("🔌 Disconnecting SSE");
            eventSource.close();
        };
    }, [userId]);
};
