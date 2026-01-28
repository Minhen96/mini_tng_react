import './App.css'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Test from './pages/Test'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OtpPage from './pages/OtpPage'

import HomePage from './pages/HomePage'
import TopUpPage from './pages/TopUpPage'
import TransferPage from './pages/TransferPage'
import TransactionHistoryPage from './pages/TransactionHistoryPage'
import TransactionDetailsPage from './pages/TransactionDetailsPage'

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/verify-otp" element={<OtpPage/>}/>
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage/>} />
          <Route path="/top-up" element={<TopUpPage/>} />
          <Route path="/transfer" element={<TransferPage/>} />
          <Route path="/test" element={<Test/>} />
          <Route path="/transaction-history" element={<TransactionHistoryPage/>}/>
          <Route path="/transaction/:transactionId" element={<TransactionDetailsPage/>}/>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
