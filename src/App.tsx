import './App.css'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Test from './pages/Test'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OtpPage from './pages/OtpPage'

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/verify-otp" element={<OtpPage/>}/>
        
        <Route element={<ProtectedRoute />}>
          <Route path="/test" element={<Test/>} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
