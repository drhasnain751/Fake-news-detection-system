import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import { Search, UserCheck, UserX, Trash2, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers({ page, limit:15, search });
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const toggleUser = async (id) => {
    try {
      const { data } = await adminAPI.toggleUser(id);
      toast.success(data.message);
      fetchUsers();
    } catch { toast.error('Action failed'); }
  };

  const deleteUser = async (id, name) => {
    if (!confirm(`Delete user "${name}" and all their data?`)) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ color:'white', fontSize:'1.5rem', fontWeight:700, marginBottom:4 }}>User Management</h1>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.875rem', margin:0 }}>{total} registered users</p>
      </div>

      {/* Search */}
      <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1); }} style={{ display:'flex', gap:10, marginBottom:20 }}>
        <div style={{ position:'relative', flex:1, maxWidth:360 }}>
          <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} />
          <input className="form-input" placeholder="Search by name or email..." value={searchInput}
            onChange={e => setSearchInput(e.target.value)} style={{ paddingLeft:36 }} />
        </div>
        <button type="submit" className="btn-primary" style={{ padding:'10px 20px' }}>Search</button>
        {search && <button type="button" className="btn-secondary" style={{ padding:'10px 16px' }} onClick={() => { setSearch(''); setSearchInput(''); }}>Clear</button>}
      </form>

      <motion.div className="glass" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ borderRadius:16, overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:40, textAlign:'center' }}><div className="spinner" style={{ margin:'0 auto' }} /></div>
        ) : users.length === 0 ? (
          <div style={{ padding:60, textAlign:'center', color:'rgba(255,255,255,0.25)' }}>No users found</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th><th>Last Login</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'white', fontSize:'0.85rem', flexShrink:0 }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ color:'white', fontWeight:500, fontSize:'0.875rem' }}>{u.name}</div>
                        <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.75rem' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {u.role === 'admin'
                      ? <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:'rgba(249,115,22,0.15)', border:'1px solid rgba(249,115,22,0.3)', borderRadius:99, padding:'3px 10px', fontSize:'0.75rem', color:'#f97316', fontWeight:600 }}><Shield size={10}/>Admin</span>
                      : <span style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.83rem' }}>User</span>}
                  </td>
                  <td>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:'0.8rem', fontWeight:500, color: u.isActive ? '#34d399' : '#f87171' }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', background: u.isActive ? '#10b981' : '#ef4444' }} />
                      {u.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ fontSize:'0.8rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontSize:'0.8rem' }}>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => toggleUser(u._id)} title={u.isActive ? 'Disable' : 'Enable'}
                        style={{ width:32, height:32, borderRadius:8, background: u.isActive ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', border:`1px solid ${u.isActive ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color: u.isActive ? '#f87171' : '#34d399' }}>
                        {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                      <button onClick={() => deleteUser(u._id, u.name)} title="Delete user"
                        style={{ width:32, height:32, borderRadius:8, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#f87171' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {pages > 1 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginTop:20 }}>
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="btn-secondary" style={{ padding:'8px 14px', opacity: page===1 ? 0.4 : 1 }}><ChevronLeft size={16}/></button>
          <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.875rem' }}>Page {page} of {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages,p+1))} disabled={page===pages} className="btn-secondary" style={{ padding:'8px 14px', opacity: page===pages ? 0.4 : 1 }}><ChevronRight size={16}/></button>
        </div>
      )}
    </AdminLayout>
  );
}
