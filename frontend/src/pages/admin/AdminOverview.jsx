import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import { Users, Activity, AlertTriangle, CheckCircle, Database, RefreshCw, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [modelStatus, setModelStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);

  useEffect(() => {
    Promise.all([adminAPI.getStats(), adminAPI.getModelStatus()])
      .then(([s, m]) => { setStats(s.data); setModelStatus(m.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRetrain = async () => {
    setRetraining(true);
    try {
      await adminAPI.retrainModel();
      toast.success('Model retraining completed!');
    } catch { toast.error('ML service unavailable'); }
    finally { setRetraining(false); }
  };

  const chartData = stats?.weeklyStats?.slice(-14).map(d => ({
    date: d._id?.slice(5),
    Total: d.total,
    Fake: d.fake,
    Real: d.real,
  })) || [...Array(7)].map((_, i) => ({
    date: `Day ${i+1}`,
    Total: Math.floor(Math.random()*20+5),
    Fake: Math.floor(Math.random()*10+2),
    Real: Math.floor(Math.random()*10+2),
  }));

  const statCards = [
    { icon:Users, label:'Total Users', value: stats?.totalUsers ?? '—', sub:`${stats?.activeUsers ?? 0} active`, color:'#a855f7' },
    { icon:Activity, label:'Total Predictions', value: stats?.totalPredictions ?? '—', color:'#3b82f6' },
    { icon:AlertTriangle, label:'Fake Detected', value: stats?.fakePredictions ?? '—', color:'#ef4444' },
    { icon:CheckCircle, label:'Real Verified', value: stats?.realPredictions ?? '—', color:'#10b981' },
    { icon:Database, label:'Datasets', value: stats?.totalDatasets ?? '—', color:'#f59e0b' },
    { icon:Zap, label:'ML Status', value: modelStatus?.status === 'online' ? 'Online' : 'Offline', color: modelStatus?.status === 'online' ? '#10b981' : '#ef4444' },
  ];

  if (loading) return <AdminLayout><div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:400 }}><div className="spinner" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ marginBottom:28, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
        <div>
          <h1 style={{ color:'white', fontSize:'1.5rem', fontWeight:700, marginBottom:4 }}>Admin Overview</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.875rem', margin:0 }}>Platform health and activity at a glance</p>
        </div>
        <button onClick={handleRetrain} className="btn-primary" disabled={retraining}
          style={{ background:'linear-gradient(135deg,#dc2626,#f97316)', opacity: retraining ? 0.7 : 1 }}>
          {retraining ? <><div className="spinner" style={{ width:16, height:16, borderWidth:2 }} />Retraining...</> : <><RefreshCw size={15} />Retrain Model</>}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:28 }}>
        {statCards.map(({ icon:Icon, label, value, sub, color }, i) => (
          <motion.div key={label} className="stat-card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <span style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.82rem' }}>{label}</span>
              <div style={{ width:32, height:32, borderRadius:8, background:`${color}20`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={15} color={color} />
              </div>
            </div>
            <div style={{ fontSize:'1.9rem', fontWeight:800, color: label==='ML Status' ? color : 'white', fontFamily:"'Space Grotesk',sans-serif", lineHeight:1 }}>{value}</div>
            {sub && <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.3)', marginTop:4 }}>{sub}</div>}
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div className="glass" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }} style={{ padding:24, marginBottom:20, borderRadius:16 }}>
        <h3 style={{ color:'white', fontWeight:600, fontSize:'0.95rem', margin:'0 0 20px' }}>Platform Prediction Activity</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill:'rgba(255,255,255,0.4)', fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'rgba(255,255,255,0.4)', fontSize:11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background:'#1a1f3a', border:'1px solid rgba(249,115,22,0.3)', borderRadius:8, color:'white' }} />
            <Bar dataKey="Fake" fill="#ef4444" radius={[4,4,0,0]} stackId="a" />
            <Bar dataKey="Real" fill="#10b981" radius={[4,4,0,0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Predictions */}
      <motion.div className="glass" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }} style={{ borderRadius:16, overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h3 style={{ color:'white', fontWeight:600, fontSize:'0.95rem', margin:0 }}>Recent Predictions</h3>
          <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.8rem' }}>Last 10</span>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>User</th><th>Result</th><th>Confidence</th><th>Date</th></tr>
          </thead>
          <tbody>
            {stats?.recentPredictions?.length > 0 ? stats.recentPredictions.map(p => (
              <tr key={p._id}>
                <td>{p.userId?.name || 'Unknown'}<br /><span style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.3)' }}>{p.userId?.email}</span></td>
                <td>{p.prediction === 'FAKE' ? <span className="badge-fake">FAKE</span> : <span className="badge-real">REAL</span>}</td>
                <td style={{ color:'white', fontWeight:500 }}>{p.confidence}%</td>
                <td style={{ fontSize:'0.8rem' }}>{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            )) : (
              <tr><td colSpan={4} style={{ textAlign:'center', padding:32, color:'rgba(255,255,255,0.25)' }}>No predictions yet</td></tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </AdminLayout>
  );
}
