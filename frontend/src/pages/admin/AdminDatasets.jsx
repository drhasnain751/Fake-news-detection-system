import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { datasetAPI } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import { Upload, Trash2, Database, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDatasets() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ datasetName:'', description:'' });
  const fileRef = useRef();

  const fetchDatasets = () => {
    setLoading(true);
    datasetAPI.getAll()
      .then(({ data }) => setDatasets(data.datasets))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDatasets(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileRef.current?.files[0];
    if (!file) { toast.error('Please select a CSV file'); return; }
    if (!form.datasetName.trim()) { toast.error('Dataset name required'); return; }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('datasetName', form.datasetName);
    formData.append('description', form.description);
    setUploading(true);
    try {
      await datasetAPI.upload(formData);
      toast.success('Dataset uploaded successfully!');
      setForm({ datasetName:'', description:'' });
      if (fileRef.current) fileRef.current.value = '';
      fetchDatasets();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this dataset?')) return;
    try { await datasetAPI.delete(id); toast.success('Dataset deleted'); fetchDatasets(); }
    catch { toast.error('Delete failed'); }
  };

  const statusIcon = (status) => {
    if (status === 'ready') return <CheckCircle size={14} color="#10b981" />;
    if (status === 'processing') return <Clock size={14} color="#f59e0b" />;
    return <AlertTriangle size={14} color="#ef4444" />;
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ color:'white', fontSize:'1.5rem', fontWeight:700, marginBottom:4 }}>Dataset Management</h1>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.875rem', margin:0 }}>Upload and manage ML training datasets</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:20 }}>
        {/* Upload form */}
        <motion.div className="glass-strong" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} style={{ padding:28, borderRadius:20, height:'fit-content' }}>
          <h2 style={{ color:'white', fontWeight:700, fontSize:'1.05rem', margin:'0 0 20px', display:'flex', alignItems:'center', gap:8 }}>
            <Upload size={18} color="#f97316" /> Upload New Dataset
          </h2>
          <form onSubmit={handleUpload} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label className="form-label">Dataset Name *</label>
              <input className="form-input" type="text" placeholder="e.g., FakeNewsNet 2024" value={form.datasetName} onChange={e => setForm({...form, datasetName:e.target.value})} />
            </div>
            <div>
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={2} placeholder="Brief description of this dataset..." value={form.description} onChange={e => setForm({...form, description:e.target.value})} style={{ resize:'vertical' }} />
            </div>
            <div>
              <label className="form-label">CSV File *</label>
              <div style={{ border:'2px dashed rgba(249,115,22,0.3)', borderRadius:12, padding:20, textAlign:'center', cursor:'pointer', background:'rgba(249,115,22,0.04)' }}
                onClick={() => fileRef.current?.click()}>
                <Upload size={24} color="rgba(249,115,22,0.6)" style={{ margin:'0 auto 8px', display:'block' }} />
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.83rem', margin:0 }}>Click to browse CSV file</p>
                <p style={{ color:'rgba(255,255,255,0.25)', fontSize:'0.75rem', margin:'4px 0 0' }}>Max 50MB</p>
                <input ref={fileRef} type="file" accept=".csv" style={{ display:'none' }} onChange={e => { if(e.target.files[0]) toast.success(`Selected: ${e.target.files[0].name}`); }} />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={uploading} style={{ background:'linear-gradient(135deg,#dc2626,#f97316)', justifyContent:'center', opacity: uploading ? 0.7 : 1 }}>
              {uploading ? <><div className="spinner" style={{ width:16, height:16, borderWidth:2 }} />Uploading...</> : <><Upload size={15} />Upload Dataset</>}
            </button>
          </form>
        </motion.div>

        {/* Dataset list */}
        <div>
          <h3 style={{ color:'white', fontWeight:600, fontSize:'0.95rem', margin:'0 0 16px' }}>Existing Datasets ({datasets.length})</h3>
          {loading ? (
            <div style={{ padding:40, textAlign:'center' }}><div className="spinner" style={{ margin:'0 auto' }} /></div>
          ) : datasets.length === 0 ? (
            <div className="glass" style={{ padding:40, textAlign:'center', borderRadius:16 }}>
              <Database size={32} color="rgba(255,255,255,0.2)" style={{ display:'block', margin:'0 auto 12px' }} />
              <p style={{ color:'rgba(255,255,255,0.25)', margin:0 }}>No datasets uploaded yet</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {datasets.map(d => (
                <motion.div key={d._id} className="glass" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                  style={{ padding:'18px 20px', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <div style={{ fontWeight:600, color:'white', fontSize:'0.9rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.datasetName}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                        {statusIcon(d.status)}
                        <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.4)', textTransform:'capitalize' }}>{d.status}</span>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                      {[
                        `📦 ${d.totalRecords?.toLocaleString()} records`,
                        `⚠ ${d.fakeCount?.toLocaleString()} fake`,
                        `✅ ${d.realCount?.toLocaleString()} real`,
                        `🎯 ${d.accuracy}% acc`,
                      ].map(tag => <span key={tag} style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.75rem' }}>{tag}</span>)}
                    </div>
                    <div style={{ color:'rgba(255,255,255,0.25)', fontSize:'0.72rem', marginTop:4 }}>
                      {d.fileName} · {((d.fileSize||0)/1024/1024).toFixed(1)}MB · {new Date(d.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(d._id)}
                    style={{ width:32, height:32, borderRadius:8, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#f87171', flexShrink:0 }}>
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
