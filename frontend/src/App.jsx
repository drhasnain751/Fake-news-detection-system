import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Features from './pages/Features';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Dashboard pages
import Overview from './pages/dashboard/Overview';
import DetectNews from './pages/dashboard/DetectNews';
import History from './pages/dashboard/History';
import Analytics from './pages/dashboard/Analytics';
import Settings from './pages/dashboard/Settings';

// Admin pages
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPredictions from './pages/admin/AdminPredictions';
import AdminDatasets from './pages/admin/AdminDatasets';
import AdminModel from './pages/admin/AdminModel';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1f3a',
              color: 'white',
              border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: '12px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#10b981', secondary: 'white' } },
            error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
          }}
        />

        <Routes>
          {/* ── Public ─────────────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* ── Auth (redirect if logged in) ────────────── */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

          {/* ── User Dashboard ──────────────────────────── */}
          <Route path="/dashboard" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
          <Route path="/dashboard/detect" element={<ProtectedRoute><DetectNews /></ProtectedRoute>} />
          <Route path="/dashboard/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* ── Admin Panel ─────────────────────────────── */}
          <Route path="/admin" element={<AdminRoute><AdminOverview /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/predictions" element={<AdminRoute><AdminPredictions /></AdminRoute>} />
          <Route path="/admin/datasets" element={<AdminRoute><AdminDatasets /></AdminRoute>} />
          <Route path="/admin/model" element={<AdminRoute><AdminModel /></AdminRoute>} />

          {/* ── 404 ────────────────────────────────────── */}
          <Route path="*" element={
            <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#050814', flexDirection:'column', gap:16 }}>
              <div style={{ fontSize:'5rem', lineHeight:1 }}>🔍</div>
              <h1 style={{ color:'white', fontSize:'2rem', margin:0 }}>Page Not Found</h1>
              <p style={{ color:'rgba(255,255,255,0.45)', margin:0 }}>The page you're looking for doesn't exist.</p>
              <a href="/" className="btn-primary" style={{ marginTop:8 }}>Go Home</a>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
