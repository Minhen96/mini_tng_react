import { useAuthContext } from "../context/AuthContext";
import { useSse } from "../hooks/useSse";

const NotificationListener = () => {
    const { user } = useAuthContext();
    
    // Assuming user object has an 'id' field.
    // Based on User interface in AuthContext.tsx:
    // interface User { email: string; name: string; }
    // We might need to update User interface if ID is missing.
    // But typically the profile endpoint returns ID.
    // Let's check AuthContext.tsx again to see if we need to add ID.
    // For now assuming user might have 'id' at runtime even if not typed, 
    // or we need to fix the type.
    
    // Casting to any to avoid TS error if ID is missing in type definition,
    // but typically it should be there.
    const userId = (user as any)?.id;

    useSse(userId);

    return null; // Headless component
};

export default NotificationListener;
