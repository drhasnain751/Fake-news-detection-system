import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Shield, LayoutDashboard, Users, BarChart3, Database,
  Activity, LogOut, ChevronRight, Settings, Eye, Menu, X
} from 'lucide-react';

const adminNav = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Eye, label: 'Predictions', path: '/admin/predictions' },
  { icon: Database, label: 'Datasets', path: '/admin/datasets' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Activity, label: 'ML Model', path: '/admin/model' },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ padding:'0 20px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', marginBottom:12 }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
            <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#dc2626,#f97316)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Shield size={17} color="white" />
            </div>
            <div>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, color:'white', fontSize:'0.95rem' }}>
                Fake<span style={{ color:'#f97316' }}>Guard</span>
              </span>
              <div style={{ fontSize:'0.65rem', color:'#f97316', fontWeight:600, letterSpacing:'0.05em' }}>ADMIN PANEL</div>
            </div>
          </Link>
        </div>

        <nav style={{ flex:1 }}>
          {adminNav.map(({ icon: Icon, label, path }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} className={`sidebar-link ${active ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                <Icon size={17} /><span>{label}</span>
                {active && <ChevronRight size={14} style={{ marginLeft:'auto', color:'#f97316' }} />}
              </Link>
            );
          })}
          <div style={{ height:1, background:'rgba(255,255,255,0.06)', margin:'12px 20px' }} />
          <Link to="/dashboard" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <Settings size={17} /><span>User Dashboard</span>
          </Link>
        </nav>

        <div style={{ padding:'12px 0', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ padding:'10px 20px', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#dc2626,#f97316)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'white', fontSize:'0.85rem', flexShrink:0 }}>
              {user?.name?.[0]}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ color:'white', fontWeight:600, fontSize:'0.82rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
              <div style={{ color:'#f97316', fontSize:'0.7rem', fontWeight:600 }}>Administrator</div>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="sidebar-link" style={{ color:'#f87171' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header style={{ height:60, display:'flex', alignItems:'center', padding:'0 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(5,8,20,0.9)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:30, gap:16 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', padding:4 }} className="mobile-only">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#f97316', boxShadow:'0 0 8px #f97316' }} className="hidden sm:block" />
          <span style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.85rem' }}>Admin Control Panel</span>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ background:'rgba(249,115,22,0.15)', border:'1px solid rgba(249,115,22,0.3)', borderRadius:6, padding:'3px 10px', fontSize:'0.75rem', color:'#f97316', fontWeight:600 }}>ADMIN</span>
          </div>
        </header>
        <motion.main key={location.pathname} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }} style={{ padding:28, minHeight:'calc(100vh - 60px)' }}>
          {children}
        </motion.main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:39, backdropFilter:'blur(4px)' }} />}
    </div>
  );
}
