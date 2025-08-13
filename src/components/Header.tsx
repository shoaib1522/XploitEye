import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { AuthModal } from './auth'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  const handleAuthClick = (mode: 'login' | 'signup') => {
    console.log('handleAuthClick called with mode:', mode);
    setAuthMode(mode);
    setAuthModalOpen(true);
  }

  const navItems = [
    { name: 'Product', href: '#' },
    { name: 'Use Cases', href: '#' },
    { name: 'Integrations', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'Learn', href: '#' },
    { name: 'Company', href: '#' }
  ]

  return (
    <motion.header 
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-brand">
            <motion.span
              className="brand-text"
              whileHover={{ rotate: 0.5, skewX: 2, y: -1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
            >
              <span className="brand-main" data-text="XploitEye">
                Xploit<span className="eye">Eye</span>
              </span>
            </motion.span>
          </div>

          <div className="nav-menu">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="nav-link"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          <div className="nav-actions">
            <motion.button 
              className="nav-link login"
              whileHover={{ scale: 1.05 }}
              onClick={() => handleAuthClick('login')}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Log In
            </motion.button>
            <motion.button 
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAuthClick('signup')}
            >
              Signup
            </motion.button>
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navItems.map((item) => (
              <a key={item.name} href={item.href} className="mobile-nav-link">
                {item.name}
              </a>
            ))}
            <div className="mobile-actions">
              <button 
                onClick={() => {
                  setIsMenuOpen(false)
                  handleAuthClick('login')
                }} 
                className="mobile-nav-link"
              >
                Log In
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setIsMenuOpen(false)
                  handleAuthClick('signup')
                }}
              >
                Signup
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => {
          console.log('AuthModal onClose called. Current authMode:', authMode);
          setAuthModalOpen(false);
          // Reset authMode to default when modal is closed
          // This ensures next time modal opens with correct mode
          setAuthMode('login');
          console.log('AuthMode reset to:', 'login');
        }}
        initialMode={authMode}
      />
    </motion.header>
  )
}

export default Header
