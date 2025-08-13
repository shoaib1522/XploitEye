import Header from './components/Header'
import Hero from './components/Hero'
import Footer from './components/Footer'
import AnimatedBackground from './components/MatrixRain'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import RequireAuth from './routes/RequireAuth'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <AnimatedBackground intensity={0.6} speed={1.2} particleCount={60} />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
