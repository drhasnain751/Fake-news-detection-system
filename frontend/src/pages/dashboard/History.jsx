import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { predictionAPI } from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Search, Filter, Download, Trash2, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data } = await predictionAPI.getHistory({ page, limit:10, filter, search });
      setPredictions(data.predictions);
      setTotal(data.total);
      setPages(data.pages);
    } catch { toast.error('Failed to load history'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchHistory(); }, [page, filter, search]);

  const handleDelete = async (id) => {
    try {
      await predictionAPI.delete(id);
      toast.success('Prediction deleted');
      fetchHistory();
    } catch { toast.error('Delete failed'); }
  };

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1); };

  const exportCSV = () => {
    const rows = [['Date','Prediction','Confidence','Text']];
    predictions.forEach(p => rows.push([
      new Date(p.createdAt).toLocaleString(), p.prediction, `${p.confidence}%`,
      `"${p.newsText.substring(0,100).replace(/"/g,'""')}"`
    ]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `predictions-${Date.now()}.csv`; a.click();
    toast.success('CSV exported!');
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ color:'white', fontSize:'1.5rem', fontWeight:700, marginBottom:4 }}>Prediction History</h1>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.875rem', margin:0 }}>{total} total analyses</p>
      </div>

      {/* Controls */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <form onSubmit={handleSearch} style={{ flex:1, minWidth:200, display:'flex', gap:8 }}>
          <div style={{ position:'relative', flex:1 }}>
            <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} />
            <input className="form-input" placeholder="Search articles..." value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              style={{ paddingLeft:36, paddingRight:12 }} />
          </div>
          <button type="submit" className="btn-primary" style={{ padding:'10px 18px' }}>Search</button>
        </form>

        <div style={{ display:'flex', gap:8 }}>
          <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}
            className="form-input" style={{ width:'auto', paddingRight:32 }}>
            <option value="">All</option>
            <option value="FAKE">Fake</option>
            <option value="REAL">Real</option>
          </select>
          <button onClick={exportCSV} className="btn-secondary" style={{ padding:'10px 16px' }}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <motion.div className="glass" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ borderRadius:16, overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:40, textAlign:'center' }}>
            <div className="spinner" style={{ margin:'0 auto' }} />
          </div>
        ) : predictions.length === 0 ? (
          <div style={{ padding:60, textAlign:'center' }}>
            <div style={{ fontSize:'3rem', marginBottom:12 }}>📋</div>
            <p style={{ color:'rgba(255,255,255,0.3)', margin:0 }}>No predictions found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Result</th>
                <th>Confidence</th>
                <th>Article Preview</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map(p => (
                <tr key={p._id}>
                  <td style={{ whiteSpace:'nowrap', fontSize:'0.8rem' }}>
                    {new Date(p.createdAt).toLocaleDateString()}<br />
                    <span style={{ color:'rgba(255,255,255,0.3)' }}>{new Date(p.createdAt).toLocaleTimeString()}</span>
                  </td>
                  <td>
                    {p.prediction === 'FAKE'
                      ? <span className="badge-fake"><AlertTriangle size={11} /> FAKE</span>
                      : <span className="badge-real"><CheckCircle size={11} /> REAL</span>}
                  </td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:50, height:5, background:'rgba(255,255,255,0.08)', borderRadius:3, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${p.confidence}%`, background: p.prediction==='FAKE' ? '#ef4444' : '#10b981', borderRadius:3 }} />
                      </div>
                      <span style={{ fontSize:'0.82rem', color:'white', fontWeight:500 }}>{p.confidence}%</span>
                    </div>
                  </td>
                  <td style={{ maxWidth:280 }}>
                    <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'block', fontSize:'0.83rem' }}>
                      {p.newsText.substring(0, 100)}{p.newsText.length > 100 ? '...' : ''}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(p._id)} className="btn-danger" style={{ padding:'6px 12px', fontSize:'0.78rem' }}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginTop:20 }}>
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="btn-secondary" style={{ padding:'8px 14px', opacity: page===1 ? 0.4 : 1 }}>
            <ChevronLeft size={16} />
          </button>
          <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.875rem' }}>Page {page} of {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages,p+1))} disabled={page===pages} className="btn-secondary" style={{ padding:'8px 14px', opacity: page===pages ? 0.4 : 1 }}>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
