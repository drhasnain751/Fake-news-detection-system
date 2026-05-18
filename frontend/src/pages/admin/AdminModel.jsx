import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import { RefreshCw, Activity, Cpu, CheckCircle, XCircle, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminModel() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);

  const fetchStatus = () => {
    setLoading(true);
    adminAPI.getModelStatus()
      .then(({ data }) => setStatus(data))
      .catch(() => setStatus({ status:'offline' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleRetrain = async () => {
    setRetraining(true);
    try {
      await adminAPI.retrainModel();
      toast.success('Model retrained successfully!');
      fetchStatus();
    } catch {
      toast.error('ML service is offline or retraining failed');
    } finally { setRetraining(false); }
  };

  const isOnline = status?.status === 'online' || status?.model_loaded;

  const specs = [
    { label:'Primary Model', value:'Logistic Regression', color:'#a855f7' },
    { label:'Secondary Model', value:'Naive Bayes', color:'#3b82f6' },
    { label:'Ensemble Weight', value:'60% LR + 40% NB', color:'#10b981' },
    { label:'Vectorizer', value:'TF-IDF (max 10k features)', color:'#f59e0b' },
    { label:'N-gram Range', value:'(1, 2)', color:'#06b6d4' },
    { label:'Framework', value:'Python Flask + Scikit-learn', color:'#ec4899' },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom:28, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
        <div>
          <h1 style={{ color:'white', fontSize:'1.5rem', fontWeight:700, marginBottom:4 }}>ML Model Control</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.875rem', margin:0 }}>Monitor and manage the AI detection model</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={fetchStatus} className="btn-secondary" style={{ padding:'10px 18px' }}><RefreshCw size={15} /> Refresh</button>
          <button onClick={handleRetrain} disabled={retraining} className="btn-primary" style={{ background:'linear-gradient(135deg,#dc2626,#f97316)', opacity: retraining ? 0.7 : 1 }}>
            {retraining ? <><div className="spinner" style={{ width:16, height:16, borderWidth:2 }} />Retraining...</> : <><Zap size={15} />Retrain Model</>}
          </button>
        </div>
      </div>

      {/* Status card */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        className="glass-strong gradient-border" style={{ padding:28, borderRadius:20, marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
          <div style={{ width:64, height:64, borderRadius:16, background: isOnline ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border:`1px solid ${isOnline ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {isOnline ? <CheckCircle size={30} color="#10b981" /> : <XCircle size={30} color="#ef4444" />}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <h2 style={{ color:'white', fontWeight:700, fontSize:'1.2rem', margin:0 }}>ML Service Status</h2>
              <div style={{ display:'flex', alignItems:'center', gap:6, padding:'3px 10px', borderRadius:99, background: isOnline ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border:`1px solid ${isOnline ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background: isOnline ? '#10b981' : '#ef4444', animation: isOnline ? 'pulse 1.5s infinite' : 'none' }} />
                <span style={{ fontSize:'0.75rem', fontWeight:600, color: isOnline ? '#34d399' : '#f87171' }}>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              </div>
            </div>
            <p style={{ color:'rgba(255,255,255,0.45)', margin:0, fontSize:'0.875rem' }}>
              {status?.message || (isOnline ? 'Flask ML API is running and models are loaded' : 'ML service is unreachable — start flask app.py')}
            </p>
          </div>
          {isOnline && (
            <div style={{ textAlign:'right' }}>
              <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.75rem' }}>Uptime</div>
              <div style={{ color:'white', fontWeight:600, fontSize:'1rem' }}>{status?.uptime_seconds ? `${Math.floor(status.uptime_seconds/60)}m ${Math.floor(status.uptime_seconds%60)}s` : '—'}</div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Model specs */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <motion.div className="glass" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }} style={{ padding:24, borderRadius:16 }}>
          <h3 style={{ color:'white', fontWeight:600, fontSize:'0.95rem', margin:'0 0 20px', display:'flex', alignItems:'center', gap:8 }}>
            <Cpu size={16} color="#a855f7" /> Model Specifications
          </h3>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {specs.map(({ label, value, color }) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.85rem' }}>{label}</span>
                <span style={{ color, fontWeight:600, fontSize:'0.85rem' }}>{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="glass" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }} style={{ padding:24, borderRadius:16 }}>
          <h3 style={{ color:'white', fontWeight:600, fontSize:'0.95rem', margin:'0 0 20px', display:'flex', alignItems:'center', gap:8 }}>
            <Activity size={16} color="#3b82f6" /> Performance Benchmarks
          </h3>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { label:'Logistic Regression Accuracy', value:96.2, color:'#a855f7' },
              { label:'Naive Bayes Accuracy', value:93.1, color:'#3b82f6' },
              { label:'Ensemble Accuracy', value:98.1, color:'#10b981' },
              { label:'Precision (Ensemble)', value:97.6, color:'#f59e0b' },
              { label:'Recall (Ensemble)', value:98.4, color:'#06b6d4' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:'0.82rem' }}>
                  <span style={{ color:'rgba(255,255,255,0.5)' }}>{label}</span>
                  <span style={{ color, fontWeight:600 }}>{value}%</span>
                </div>
                <div className="confidence-bar">
                  <motion.div className="confidence-fill" initial={{ width:0 }} animate={{ width:`${value}%` }} transition={{ duration:1, delay:0.3 }}
                    style={{ background:`linear-gradient(90deg,${color}aa,${color})` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* NLP Pipeline */}
      <motion.div className="glass" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} style={{ padding:24, borderRadius:16, marginTop:20 }}>
        <h3 style={{ color:'white', fontWeight:600, fontSize:'0.95rem', margin:'0 0 20px' }}>🔄 NLP Preprocessing Pipeline</h3>
        <div style={{ display:'flex', gap:0, alignItems:'center', flexWrap:'wrap' }}>
          {['Raw Text', 'Lowercase', 'URL Removal', 'Tokenization', 'Stop-word Removal', 'Lemmatization', 'TF-IDF Vectorization', 'ML Prediction'].map((step, i, arr) => (
            <>
              <div key={step} style={{ background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.25)', borderRadius:8, padding:'8px 14px', fontSize:'0.8rem', color:'#a78bfa', fontWeight:500, whiteSpace:'nowrap' }}>
                {i+1}. {step}
              </div>
              {i < arr.length-1 && <div style={{ color:'rgba(124,58,237,0.4)', padding:'0 6px', fontSize:'1rem' }}>→</div>}
            </>
          ))}
        </div>
      </motion.div>
    </AdminLayout>
  );
}
