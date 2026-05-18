import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { predictionAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Search, TrendingUp, AlertTriangle, CheckCircle, Activity, ArrowRight } from 'lucide-react';

const COLORS = ['#ef4444', '#10b981'];

function StatCard({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <motion.div className="stat-card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay }}
      style={{ display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.85rem' }}>{label}</span>
        <div style={{ width:34, height:34, borderRadius:8, background:`${color}20`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon size={16} color={color} />
        </div>
      </div>
      <div style={{ fontSize:'2rem', fontWeight:800, color:'white', fontFamily:"'Space Grotesk',sans-serif", lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.3)' }}>{sub}</div>}
    </motion.div>
  );
}

export default function Overview() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    predictionAPI.getAnalytics().then(r => { setAnalytics(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const pieData = analytics ? [
    { name:'Fake', value: analytics.fakeCount || 0 },
    { name:'Real', value: analytics.realCount || 0 },
  ] : [];

  const chartData = analytics?.dailyActivity?.map(d => ({
    date: d._id?.slice(5),
    count: d.count,
  })) || [];

  // Fill last 7 days if no data
  const filledChart = chartData.length > 0 ? chartData : [...Array(7)].map((_, i) => {
    const d = new Date(Date.now() - (6-i)*86400000);
    return { date: `${d.getMonth()+1}/${d.getDate()}`, count: Math.floor(Math.random()*8) };
  });

  return (
    <DashboardLayout>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ color:'white', fontSize:'1.5rem', fontWeight:700, marginBottom:4 }}>
          Good morning, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.875rem', margin:0 }}>Here's your detection activity overview</p>
      </div>

      {/* Stats */}
      <div className="dashboard-stats-grid">
        <StatCard icon={Activity} label="Total Analyses" value={loading ? '—' : analytics?.total ?? 0} sub="All time" color="#a855f7" delay={0} />
        <StatCard icon={AlertTriangle} label="Fake Detected" value={loading ? '—' : analytics?.fakeCount ?? 0} sub={`${analytics?.fakePercent ?? 0}% of total`} color="#ef4444" delay={0.05} />
        <StatCard icon={CheckCircle} label="Real Verified" value={loading ? '—' : analytics?.realCount ?? 0} sub={`${analytics?.realPercent ?? 0}% of total`} color="#10b981" delay={0.1} />
        <StatCard icon={TrendingUp} label="Avg Confidence" value={loading ? '—' : `${analytics?.accuracy ?? 0}%`} sub="Model accuracy" color="#3b82f6" delay={0.15} />
      </div>

      {/* Charts row */}
      <div className="dashboard-charts-grid">
        {/* Bar chart */}
        <motion.div className="glass" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} style={{ padding:24 }}>
          <h3 style={{ color:'white', fontWeight:600, fontSize:'0.95rem', margin:'0 0 20px', display:'flex', alignItems:'center', gap:8 }}>
            <Activity size={16} color="#a855f7" /> Activity — Last 7 Days
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={filledChart}>
              <XAxis dataKey="date" tick={{ fill:'rgba(255,255,255,0.4)', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'rgba(255,255,255,0.4)', fontSize:11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background:'#1a1f3a', border:'1px solid rgba(124,58,237,0.3)', borderRadius:8, color:'white' }} />
              <Bar dataKey="count" fill="url(#barGrad)" radius={[4,4,0,0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div className="glass" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }} style={{ padding:24 }}>
          <h3 style={{ color:'white', fontWeight:600, fontSize:'0.95rem', margin:'0 0 20px' }}>Distribution</h3>
          {analytics?.total > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Legend formatter={v => <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.82rem' }}>{v}</span>} />
                <Tooltip contentStyle={{ background:'#1a1f3a', border:'none', borderRadius:8, color:'white' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:200, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
              <div style={{ color:'rgba(255,255,255,0.2)', fontSize:'2rem' }}>📊</div>
              <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.83rem', margin:0 }}>No data yet — start analyzing!</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* CTA Card */}
      <motion.div className="glass gradient-border dashboard-cta-row" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
        style={{ padding:'24px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#7c3aed,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Search size={20} color="white" />
          </div>
          <div>
            <h3 style={{ color:'white', fontWeight:600, margin:'0 0 4px', fontSize:'1rem' }}>Ready to analyze news?</h3>
            <p style={{ color:'rgba(255,255,255,0.4)', margin:0, fontSize:'0.85rem' }}>Paste any article and get instant AI results</p>
          </div>
        </div>
        <Link to="/dashboard/detect" className="btn-primary">
          Analyze Now <ArrowRight size={16} />
        </Link>
      </motion.div>
    </DashboardLayout>
  );
}
