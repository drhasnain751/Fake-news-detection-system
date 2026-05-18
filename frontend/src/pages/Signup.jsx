import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const strengthLevels = [
  { label: 'Weak', color: '#ef4444', min: 0 },
  { label: 'Fair', color: '#f59e0b', min: 1 },
  { label: 'Good', color: '#3b82f6', min: 2 },
  { label: 'Strong', color: '#10b981', min: 3 },
];

function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export default function Signup() {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' });
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();
  const strength = getStrength(form.password);
  const strengthInfo = strengthLevels[Math.min(strength, 3)];

  const rules = [
    { label: 'At least 8 characters', ok: form.password.length >= 8 },
    { label: 'One uppercase letter', ok: /[A-Z]/.test(form.password) },
    { label: 'One number', ok: /[0-9]/.test(form.password) },
    { label: 'Passwords match', ok: form.password && form.password === form.confirm },
  ];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!agreed) e.agreed = 'You must accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'#050814' }}>
      {/* Left panel */}
      <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }}
        style={{ flex:'0 0 45%', display:'flex', flexDirection:'column', justifyContent:'center', padding:56, position:'relative', overflow:'hidden', background:'rgba(124,58,237,0.04)', borderRight:'1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="orb" style={{ width:450, height:450, background:'#7c3aed', top:-150, right:-100 }} />
        <div className="orb" style={{ width:300, height:300, background:'#06b6d4', bottom:-50, left:-50 }} />
        <div className="bg-grid" style={{ position:'absolute', inset:0 }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', marginBottom:40 }}>
            <div style={{ width:36, height:36, borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Shield size={18} color="white" />
            </div>
            <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'1.1rem', color:'white' }}>Fake<span style={{ color:'#a855f7' }}>Guard</span></span>
          </Link>
          <h2 style={{ fontSize:'2.2rem', fontWeight:800, color:'white', marginBottom:12 }}>
            Join the fight against <span className="gradient-text">misinformation</span>
          </h2>
          <p style={{ color:'rgba(255,255,255,0.5)', lineHeight:1.7, marginBottom:36 }}>
            Create your free account and start analyzing news articles with our AI-powered detection engine.
          </p>
          {[
            '✅ Free forever — no credit card needed',
            '🤖 Access to AI detection engine',
            '📊 Full analytics dashboard',
            '🔒 Secure JWT authentication',
            '📥 Export reports as PDF',
          ].map(item => (
            <div key={item} style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.9rem', marginBottom:10 }}>{item}</div>
          ))}
        </div>
      </motion.div>

      {/* Right panel: form */}
      <motion.div initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }}
        style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:48, overflowY:'auto' }}>
        <div style={{ width:'100%', maxWidth:420 }}>
          <h1 style={{ fontSize:'1.8rem', fontWeight:800, color:'white', marginBottom:6 }}>Create your account</h1>
          <p style={{ color:'rgba(255,255,255,0.5)', marginBottom:28, fontSize:'0.9rem' }}>
            Already have one? <Link to="/login" style={{ color:'#a855f7', textDecoration:'none', fontWeight:500 }}>Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {/* Name */}
            <div>
              <label className="form-label">Full name</label>
              <div style={{ position:'relative' }}>
                <User size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} />
                <input className="form-input" type="text" placeholder="John Doe"
                  value={form.name} onChange={e => setForm({...form, name:e.target.value})}
                  style={{ paddingLeft:40, borderColor: errors.name ? '#ef4444' : undefined }} />
              </div>
              {errors.name && <p style={{ color:'#f87171', fontSize:'0.75rem', margin:'4px 0 0' }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email address</label>
              <div style={{ position:'relative' }}>
                <Mail size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} />
                <input className="form-input" type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({...form, email:e.target.value})}
                  style={{ paddingLeft:40, borderColor: errors.email ? '#ef4444' : undefined }} />
              </div>
              {errors.email && <p style={{ color:'#f87171', fontSize:'0.75rem', margin:'4px 0 0' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} />
                <input className="form-input" type={showPw ? 'text' : 'password'} placeholder="Create a strong password"
                  value={form.password} onChange={e => setForm({...form, password:e.target.value})}
                  style={{ paddingLeft:40, paddingRight:42, borderColor: errors.password ? '#ef4444' : undefined }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div style={{ marginTop:8 }}>
                  <div style={{ display:'flex', gap:4, marginBottom:4 }}>
                    {[0,1,2,3].map(i => (
                      <div key={i} className="strength-bar" style={{ flex:1, height:3, background: i < strength ? strengthInfo.color : 'rgba(255,255,255,0.1)' }} />
                    ))}
                  </div>
                  <span style={{ fontSize:'0.75rem', color: strengthInfo.color }}>{strengthInfo.label} password</span>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="form-label">Confirm password</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} />
                <input className="form-input" type="password" placeholder="Repeat your password"
                  value={form.confirm} onChange={e => setForm({...form, confirm:e.target.value})}
                  style={{ paddingLeft:40, borderColor: errors.confirm ? '#ef4444' : undefined }} />
              </div>
              {errors.confirm && <p style={{ color:'#f87171', fontSize:'0.75rem', margin:'4px 0 0' }}>{errors.confirm}</p>}
            </div>

            {/* Rules */}
            {form.password && (
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {rules.map(({ label, ok }) => (
                  <div key={label} style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.78rem', color: ok ? '#34d399' : 'rgba(255,255,255,0.35)' }}>
                    {ok ? <Check size={12} /> : <X size={12} />} {label}
                  </div>
                ))}
              </div>
            )}

            {/* Terms */}
            <label style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer' }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop:2, accentColor:'#7c3aed' }} />
              <span style={{ fontSize:'0.83rem', color:'rgba(255,255,255,0.5)', lineHeight:1.5 }}>
                I agree to the <a href="#" style={{ color:'#a855f7' }}>Terms of Service</a> and <a href="#" style={{ color:'#a855f7' }}>Privacy Policy</a>
              </span>
            </label>
            {errors.agreed && <p style={{ color:'#f87171', fontSize:'0.75rem', margin:'-10px 0 0' }}>{errors.agreed}</p>}

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:'0.95rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? <><div className="spinner" style={{ width:18, height:18, borderWidth:2 }} /> Creating account...</> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
