import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import { User, Lock, Bell, Palette, Save, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
  { id:'profile', label:'Profile', icon: User },
  { id:'password', label:'Password', icon: Lock },
  { id:'notifications', label:'Notifications', icon: Bell },
  { id:'appearance', label:'Appearance', icon: Palette },
];

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pwForm, setPwForm] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState(user?.notifications ?? true);

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile({ name: profileForm.name, notifications });
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally { setSaving(false); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (!pwForm.currentPassword || !pwForm.newPassword) { toast.error('All fields required'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword:'', newPassword:'', confirmPassword:'' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Password change failed');
    } finally { setSaving(false); }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ color:'white', fontSize:'1.5rem', fontWeight:700, marginBottom:4 }}>Settings</h1>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.875rem', margin:0 }}>Manage your account preferences</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:20 }}>
        {/* Tab sidebar */}
        <div className="glass" style={{ padding:8, borderRadius:16, height:'fit-content' }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`sidebar-link ${activeTab===id ? 'active' : ''}`}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 14px', fontSize:'0.875rem' }}>
              <Icon size={16} />{label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div key={activeTab} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} className="glass-strong" style={{ padding:32, borderRadius:20 }}>

          {activeTab === 'profile' && (
            <form onSubmit={saveProfile}>
              <h2 style={{ color:'white', fontWeight:700, fontSize:'1.1rem', margin:'0 0 24px' }}>Profile Information</h2>
              {/* Avatar */}
              <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
                <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', fontWeight:700, color:'white' }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ color:'white', fontWeight:600, margin:'0 0 4px', fontSize:'0.95rem' }}>{user?.name}</p>
                  <p style={{ color:'rgba(255,255,255,0.35)', margin:0, fontSize:'0.8rem' }}>
                    Member since {new Date(user?.createdAt).toLocaleDateString()} · {user?.role}
                  </p>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <input className="form-input" type="text" value={profileForm.name}
                    onChange={e => setProfileForm({...profileForm, name:e.target.value})} />
                </div>
                <div>
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" value={profileForm.email} disabled
                    style={{ opacity:0.5, cursor:'not-allowed' }} />
                  <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.75rem', margin:'4px 0 0' }}>Email cannot be changed</p>
                </div>
                <div>
                  <label className="form-label">Account Role</label>
                  <div style={{ padding:'11px 16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12 }}>
                    <span className="chip">{user?.role === 'admin' ? '👑 Administrator' : '👤 User'}</span>
                  </div>
                </div>
                <button type="submit" className="btn-primary" disabled={saving} style={{ alignSelf:'flex-start', padding:'11px 24px' }}>
                  {saving ? <><div className="spinner" style={{ width:16, height:16, borderWidth:2 }} />Saving...</> : <><Save size={15} />Save Changes</>}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={savePassword}>
              <h2 style={{ color:'white', fontWeight:700, fontSize:'1.1rem', margin:'0 0 24px' }}>Change Password</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:18, maxWidth:440 }}>
                {[
                  { label:'Current Password', key:'currentPassword' },
                  { label:'New Password', key:'newPassword' },
                  { label:'Confirm New Password', key:'confirmPassword' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="form-label">{label}</label>
                    <div style={{ position:'relative' }}>
                      <Lock size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} />
                      <input className="form-input" type={showPw ? 'text' : 'password'} value={pwForm[key]}
                        onChange={e => setPwForm({...pwForm, [key]:e.target.value})}
                        style={{ paddingLeft:38, paddingRight:42 }} />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer' }}>
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
                <button type="submit" className="btn-primary" disabled={saving} style={{ alignSelf:'flex-start', padding:'11px 24px' }}>
                  {saving ? <><div className="spinner" style={{ width:16, height:16, borderWidth:2 }} />Saving...</> : <><Save size={15} />Update Password</>}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ color:'white', fontWeight:700, fontSize:'1.1rem', margin:'0 0 24px' }}>Notification Preferences</h2>
              {[
                { label:'Analysis Complete Alerts', desc:'Notify when AI analysis finishes', key:'analysis' },
                { label:'Weekly Summary Emails', desc:'Receive weekly activity report via email', key:'weekly' },
                { label:'Security Alerts', desc:'Alerts for login from new devices', key:'security' },
              ].map(({ label, desc, key }) => (
                <div key={key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <div style={{ color:'white', fontWeight:500, fontSize:'0.9rem', marginBottom:3 }}>{label}</div>
                    <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.8rem' }}>{desc}</div>
                  </div>
                  <label style={{ display:'flex', alignItems:'center', cursor:'pointer' }}>
                    <input type="checkbox" defaultChecked={notifications} onChange={e => setNotifications(e.target.checked)}
                      style={{ width:40, height:22, accentColor:'#7c3aed', cursor:'pointer' }} />
                  </label>
                </div>
              ))}
              <button className="btn-primary" style={{ marginTop:24, padding:'11px 24px' }} onClick={() => toast.success('Notification preferences saved!')}>
                <Save size={15} /> Save Preferences
              </button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h2 style={{ color:'white', fontWeight:700, fontSize:'1.1rem', margin:'0 0 24px' }}>Appearance</h2>
              <div style={{ marginBottom:24 }}>
                <label className="form-label" style={{ marginBottom:12 }}>Theme</label>
                <div style={{ display:'flex', gap:12 }}>
                  {[{ id:'dark', label:'🌑 Dark', active:true }, { id:'light', label:'☀️ Light', active:false }].map(({ id, label, active }) => (
                    <button key={id} onClick={() => toast.success('Dark mode is the only available theme currently')}
                      style={{ flex:1, padding:'14px', borderRadius:12, border:`2px solid ${active ? '#7c3aed' : 'rgba(255,255,255,0.1)'}`, background: active ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)', color: active ? 'white' : 'rgba(255,255,255,0.4)', cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ padding:'16px 20px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:12 }}>
                <p style={{ color:'#a78bfa', margin:0, fontSize:'0.875rem' }}>
                  💡 Light mode is coming soon in the next update.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
