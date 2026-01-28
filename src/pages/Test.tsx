import { useAuthContext } from "../context/AuthContext"

export default function Test(){
    const { logout } = useAuthContext();

    return (
        <div>
            <h1>Test Page (Protected)</h1>
            <p>If you see this, you are authenticated.</p>
            <button onClick={logout}>Logout</button>
        </div>
    )
}