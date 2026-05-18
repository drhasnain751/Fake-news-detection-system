import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      navigate(data.user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'#050814' }}>
      {/* Left panel */}
      <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }}
        style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:48, position:'relative', overflow:'hidden' }}
        className="hidden md:flex"
      >
        <div className="orb" style={{ width:500, height:500, background:'#7c3aed', top:-100, left:-100 }} />
        <div className="orb" style={{ width:300, height:300, background:'#3b82f6', bottom:-50, right:-50 }} />
        <div className="bg-grid" style={{ position:'absolute', inset:0 }} />
        <div style={{ position:'relative', zIndex:1, textAlign:'center', maxWidth:380 }}>
          <div style={{ width:80, height:80, borderRadius:20, background:'linear-gradient(135deg,#7c3aed,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
            <Brain size={40} color="white" />
          </div>
          <h2 style={{ fontSize:'2rem', fontWeight:800, color:'white', marginBottom:16 }}>
            AI-Powered <span className="gradient-text">Truth Detection</span>
          </h2>
          <p style={{ color:'rgba(255,255,255,0.55)', lineHeight:1.7 }}>
            Log in to access your dashboard, analyze news articles, and track your prediction history.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:32 }}>
            {[['98.7%', 'Detection Accuracy'],['50K+','Articles Analyzed'],['<2s','Response Time']].map(([v,l]) => (
              <div key={l} className="glass" style={{ padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.875rem' }}>{l}</span>
                <span style={{ color:'#a855f7', fontWeight:700, fontFamily:"'Space Grotesk',sans-serif" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right panel: form */}
      <motion.div initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }}
        style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:48 }}
      >
        <div style={{ width:'100%', maxWidth:400 }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', marginBottom:36 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#7c3aed,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Shield size={16} color="white" />
            </div>
            <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, color:'white' }}>Fake<span style={{ color:'#a855f7' }}>Guard</span></span>
          </Link>

          <h1 style={{ fontSize:'1.8rem', fontWeight:800, color:'white', marginBottom:8 }}>Welcome back</h1>
          <p style={{ color:'rgba(255,255,255,0.5)', marginBottom:32, fontSize:'0.9rem' }}>
            Don't have an account? <Link to="/signup" style={{ color:'#a855f7', textDecoration:'none', fontWeight:500 }}>Sign up free</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div>
              <label className="form-label">Email address</label>
              <div style={{ position:'relative' }}>
                <Mail size={16} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} />
                <input className="form-input" type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({...form, email:e.target.value})}
                  style={{ paddingLeft:42, borderColor: errors.email ? '#ef4444' : undefined }}
                />
              </div>
              {errors.email && <p style={{ color:'#f87171', fontSize:'0.78rem', marginTop:4, marginBottom:0 }}>{errors.email}</p>}
            </div>

            <div>
              <label className="form-label">Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={16} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} />
                <input className="form-input" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password} onChange={e => setForm({...form, password:e.target.value})}
                  style={{ paddingLeft:42, paddingRight:42, borderColor: errors.password ? '#ef4444' : undefined }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color:'#f87171', fontSize:'0.78rem', marginTop:4, marginBottom:0 }}>{errors.password}</p>}
            </div>

            <div style={{ display:'flex', justifyContent:'flex-end' }}>
              <a href="#" style={{ color:'#a855f7', fontSize:'0.875rem', textDecoration:'none' }}>Forgot password?</a>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:'0.95rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? <><div className="spinner" style={{ width:18, height:18, borderWidth:2 }} /> Signing in...</> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="glass" style={{ marginTop:24, padding:16, borderRadius:12 }}>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem', margin:'0 0 8px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>Demo Credentials</p>
            <button onClick={() => setForm({ email:'demo@fakeguard.ai', password:'demo1234' })}
              style={{ background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.25)', borderRadius:8, padding:'8px 14px', color:'#a78bfa', fontSize:'0.82rem', cursor:'pointer', width:'100%', fontFamily:'inherit' }}>
              👤 Use Demo Account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
