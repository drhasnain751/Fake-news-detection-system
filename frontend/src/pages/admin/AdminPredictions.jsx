import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import { Filter, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AdminPredictions() {
  const [predictions, setPredictions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminAPI.getAllPredictions({ page, limit:15 })
      .then(({ data }) => { setPredictions(data.predictions); setTotal(data.total); setPages(data.pages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <AdminLayout>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ color:'white', fontSize:'1.5rem', fontWeight:700, marginBottom:4 }}>All Predictions</h1>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.875rem', margin:0 }}>{total} total platform predictions</p>
      </div>

      <motion.div className="glass" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ borderRadius:16, overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:40, textAlign:'center' }}><div className="spinner" style={{ margin:'0 auto' }} /></div>
        ) : predictions.length === 0 ? (
          <div style={{ padding:60, textAlign:'center', color:'rgba(255,255,255,0.25)' }}>No predictions yet</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>User</th><th>Result</th><th>Confidence</th><th>Article Preview</th><th>Date</th></tr>
            </thead>
            <tbody>
              {predictions.map(p => (
                <tr key={p._id}>
                  <td>
                    <div style={{ color:'white', fontSize:'0.85rem', fontWeight:500 }}>{p.userId?.name || 'Deleted'}</div>
                    <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.75rem' }}>{p.userId?.email}</div>
                  </td>
                  <td>{p.prediction==='FAKE' ? <span className="badge-fake"><AlertTriangle size={11}/>FAKE</span> : <span className="badge-real"><CheckCircle size={11}/>REAL</span>}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:44, height:4, background:'rgba(255,255,255,0.08)', borderRadius:2, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${p.confidence}%`, background: p.prediction==='FAKE' ? '#ef4444':'#10b981', borderRadius:2 }}/>
                      </div>
                      <span style={{ color:'white', fontSize:'0.82rem', fontWeight:500 }}>{p.confidence}%</span>
                    </div>
                  </td>
                  <td style={{ maxWidth:260 }}>
                    <span style={{ display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:'0.82rem' }}>
                      {p.newsText?.substring(0, 90)}...
                    </span>
                  </td>
                  <td style={{ fontSize:'0.79rem', whiteSpace:'nowrap' }}>{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {pages > 1 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginTop:20 }}>
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="btn-secondary" style={{ padding:'8px 14px', opacity:page===1?0.4:1 }}><ChevronLeft size={16}/></button>
          <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.875rem' }}>Page {page} of {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages,p+1))} disabled={page===pages} className="btn-secondary" style={{ padding:'8px 14px', opacity:page===pages?0.4:1 }}><ChevronRight size={16}/></button>
        </div>
      )}
    </AdminLayout>
  );
}
