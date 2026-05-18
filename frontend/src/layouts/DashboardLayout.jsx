import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Shield, LayoutDashboard, Search, History, BarChart3,
  Settings, LogOut, ChevronRight, Menu, X, Bell, User
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: Search, label: 'Detect News', path: '/dashboard/detect' },
  { icon: History, label: 'History', path: '/dashboard/history' },
  { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div style={{ padding:'0 20px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', marginBottom:12 }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
            <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Shield size={17} color="white" />
            </div>
            <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, color:'white', fontSize:'1rem' }}>
              Fake<span style={{ color:'#a855f7' }}>Guard</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex:1 }}>
          {navItems.map(({ icon: Icon, label, path }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} className={`sidebar-link ${active ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                <Icon size={17} />
                <span>{label}</span>
                {active && <ChevronRight size={14} style={{ marginLeft:'auto', color:'#a855f7' }} />}
              </Link>
            );
          })}
          {user?.role === 'admin' && (
            <>
              <div style={{ height:1, background:'rgba(255,255,255,0.06)', margin:'12px 20px' }} />
              <Link to="/admin" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
                <Shield size={17} />
                <span>Admin Panel</span>
              </Link>
            </>
          )}
        </nav>

        {/* User info */}
        <div style={{ padding:'12px 0', borderTop:'1px solid rgba(255,255,255,0.06)', marginTop:'auto' }}>
          <div style={{ padding:'12px 20px', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'white', fontSize:'0.875rem', flexShrink:0 }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ color:'white', fontWeight:600, fontSize:'0.85rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.75rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-link" style={{ color:'#f87171' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="dashboard-main">
        {/* Top bar */}
        <header style={{ height:60, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(5,8,20,0.8)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:30 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', padding:4 }} className="mobile-only">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div style={{ color:'white', fontWeight:600, fontSize:'0.95rem' }}>
              {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button style={{ width:34, height:34, borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>
              <Bell size={16} />
            </button>
            <Link to="/dashboard/settings" style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'white', fontSize:'0.85rem', textDecoration:'none' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </Link>
          </div>
        </header>

        {/* Page content */}
        <motion.main
          key={location.pathname}
          initial={{ opacity:0, y:10 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.3 }}
          style={{ padding:28, minHeight:'calc(100vh - 60px)' }}
        >
          {children}
        </motion.main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:39, backdropFilter:'blur(4px)' }} />}
    </div>
  );
}
