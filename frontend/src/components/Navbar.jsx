import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Shield, Menu, X, ChevronRight, LayoutDashboard, LogOut } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Features', to: '/features' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 0',
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(5,8,20,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{
            width:38, height:38, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
            background:'linear-gradient(135deg,#7c3aed,#3b82f6)',
          }}>
            <Shield size={20} color="white" />
          </div>
          <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'1.15rem', color:'white' }}>
            Fake<span style={{ color:'#a855f7' }}>Guard</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }} className="hidden md:flex">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              padding:'8px 16px', borderRadius:8, fontWeight:500, fontSize:'0.9rem', textDecoration:'none',
              color: location.pathname === link.to ? 'white' : 'rgba(255,255,255,0.65)',
              background: location.pathname === link.to ? 'rgba(124,58,237,0.15)' : 'transparent',
              transition:'all 0.2s',
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {user ? (
            <>
              <Link to="/dashboard" className="btn-secondary" style={{ padding:'9px 18px', fontSize:'0.875rem' }}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} className="btn-primary" style={{ padding:'9px 18px', fontSize:'0.875rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary" style={{ padding:'9px 18px', fontSize:'0.875rem' }}>Login</Link>
              <Link to="/signup" className="btn-primary" style={{ padding:'9px 18px', fontSize:'0.875rem' }}>
                Get Started <ChevronRight size={15} />
              </Link>
            </>
          )}
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background:'none', border:'none', color:'white', cursor:'pointer', display:'none', marginLeft:8 }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity:0, height:0 }}
            animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }}
            style={{ background:'rgba(5,8,20,0.98)', borderTop:'1px solid rgba(255,255,255,0.06)', padding:'12px 0' }}
          >
            <div className="container">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} style={{
                  display:'block', padding:'12px 0', color:'rgba(255,255,255,0.7)', textDecoration:'none',
                  borderBottom:'1px solid rgba(255,255,255,0.05)', fontWeight:500,
                }}>{link.label}</Link>
              ))}
              <div style={{ display:'flex', gap:10, paddingTop:16 }}>
                {!user && <><Link to="/login" className="btn-secondary" style={{ flex:1, justifyContent:'center' }}>Login</Link>
                <Link to="/signup" className="btn-primary" style={{ flex:1, justifyContent:'center' }}>Sign Up</Link></>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
