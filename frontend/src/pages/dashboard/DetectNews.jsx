import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { predictionAPI } from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Brain, Send, AlertTriangle, CheckCircle, Zap, FileText, RefreshCw, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

const sampleTexts = [
  "Scientists have discovered a revolutionary cancer cure using household ingredients that pharmaceutical companies have been suppressing for decades.",
  "The Federal Reserve raised interest rates by 25 basis points at its June meeting, citing persistent inflation pressures and strong employment data.",
];

export default function DetectNews() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const resultRef = useRef(null);

  const handleAnalyze = async () => {
    if (!text.trim() || text.trim().length < 10) {
      toast.error('Please enter at least 10 characters');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data } = await predictionAPI.analyze(text);
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 100);
      toast.success(`Analysis complete — ${data.prediction} detected!`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setWordCount(e.target.value.split(/\s+/).filter(Boolean).length);
  };

  const handleClear = () => { setText(''); setResult(null); setWordCount(0); };

  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(124, 58, 237);
    doc.text('FakeGuard AI — Analysis Report', 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Prediction: ${result.prediction}`, 20, 40);
    doc.text(`Confidence: ${result.confidence}%`, 20, 52);
    doc.text(`Model: ${result.model || 'Ensemble'}`, 20, 64);
    doc.text(`Processing Time: ${result.processingTime || result.processing_time_ms || 0}ms`, 20, 76);
    doc.text(`Word Count: ${result.wordCount || wordCount}`, 20, 88);
    doc.text('News Text:', 20, 104);
    const lines = doc.splitTextToSize(text.substring(0, 800), 170);
    doc.text(lines, 20, 116);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 270);
    doc.save(`fakeguard-report-${Date.now()}.pdf`);
    toast.success('PDF downloaded!');
  };

  const isFake = result?.prediction === 'FAKE';

  return (
    <DashboardLayout>
      <div style={{ maxWidth:860, margin:'0 auto' }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ color:'white', fontSize:'1.5rem', fontWeight:700, marginBottom:4 }}>Detect Fake News</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.875rem', margin:0 }}>Paste any news article or headline below for instant AI analysis</p>
        </div>

        {/* Sample texts */}
        <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
          <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.8rem', alignSelf:'center' }}>Try:</span>
          {sampleTexts.map((s, i) => (
            <button key={i} onClick={() => { setText(s); setWordCount(s.split(/\s+/).length); }}
              style={{ background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:8, padding:'6px 12px', color:'#a78bfa', fontSize:'0.78rem', cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}>
              {i === 0 ? '⚠ Fake sample' : '✅ Real sample'}
            </button>
          ))}
        </div>

        {/* Text input */}
        <motion.div className="glass-strong" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:20, borderRadius:20, padding:4 }}>
          <textarea value={text} onChange={handleTextChange}
            placeholder="Paste a news article, headline, or social media post here..."
            rows={10}
            style={{ width:'100%', background:'transparent', border:'none', color:'white', fontSize:'0.95rem', lineHeight:1.7, padding:'20px', resize:'vertical', outline:'none', fontFamily:'inherit', borderRadius:16, boxSizing:'border-box' }}
          />
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.8rem' }}>{wordCount} words · {text.length} chars</span>
              {text && <button onClick={handleClear} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', fontSize:'0.8rem', fontFamily:'inherit', padding:0 }}>
                <RefreshCw size={12} style={{ marginRight:4, verticalAlign:'middle' }} />Clear
              </button>}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              {result && (
                <button onClick={downloadPDF} className="btn-secondary" style={{ padding:'9px 16px', fontSize:'0.85rem' }}>
                  <Download size={14} /> PDF
                </button>
              )}
              <button onClick={handleAnalyze} className="btn-primary" disabled={loading || !text.trim()}
                style={{ padding:'9px 22px', fontSize:'0.9rem', opacity: loading || !text.trim() ? 0.6 : 1 }}>
                {loading ? <><div className="spinner" style={{ width:16, height:16, borderWidth:2 }} /> Analyzing...</> : <><Send size={15} /> Analyze</>}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Processing animation */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
              className="glass" style={{ padding:32, textAlign:'center', marginBottom:20 }}>
              <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:16 }}>
                {[0,1,2].map(i => (
                  <motion.div key={i} animate={{ y:[0,-12,0], opacity:[0.5,1,0.5] }} transition={{ duration:0.8, repeat:Infinity, delay: i*0.2 }}
                    style={{ width:10, height:10, borderRadius:'50%', background:'linear-gradient(135deg,#a855f7,#3b82f6)' }} />
                ))}
              </div>
              <p style={{ color:'rgba(255,255,255,0.6)', margin:0, fontSize:'0.9rem' }}>AI is analyzing your article...</p>
              <p style={{ color:'rgba(255,255,255,0.3)', margin:'6px 0 0', fontSize:'0.8rem' }}>Running NLP pipeline · TF-IDF vectorization · ML prediction</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div ref={resultRef} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
              className="glass-strong gradient-border" style={{ padding:28, borderRadius:20 }}>
              {/* Header */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:52, height:52, borderRadius:14, background: isFake ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', border:`1px solid ${isFake ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {isFake ? <AlertTriangle size={24} color="#ef4444" /> : <CheckCircle size={24} color="#10b981" />}
                  </div>
                  <div>
                    <div style={{ fontSize:'1.6rem', fontWeight:800, color: isFake ? '#f87171' : '#34d399', fontFamily:"'Space Grotesk',sans-serif" }}>
                      {result.prediction}
                    </div>
                    <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.82rem' }}>
                      {isFake ? 'This content shows signs of misinformation' : 'This content appears to be credible'}
                    </div>
                  </div>
                </div>
                {isFake ? <span className="badge-fake" style={{ fontSize:'0.85rem', padding:'6px 16px' }}>⚠ FAKE NEWS</span> : <span className="badge-real" style={{ fontSize:'0.85rem', padding:'6px 16px' }}>✓ REAL NEWS</span>}
              </div>

              {/* Confidence */}
              <div style={{ marginBottom:24 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.875rem', fontWeight:500 }}>Confidence Score</span>
                  <span style={{ color:'white', fontWeight:700, fontSize:'1.1rem', fontFamily:"'Space Grotesk',sans-serif" }}>{result.confidence}%</span>
                </div>
                <div className="confidence-bar">
                  <motion.div className="confidence-fill" initial={{ width:0 }} animate={{ width:`${result.confidence}%` }} transition={{ duration:1, ease:'easeOut' }}
                    style={{ background: isFake ? 'linear-gradient(90deg,#dc2626,#ef4444)' : 'linear-gradient(90deg,#059669,#10b981)' }} />
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
                {[
                  { label:'Model', value: result.model || 'Ensemble' },
                  { label:'Processing', value: `${result.processingTime || result.processing_time_ms || 0}ms` },
                  { label:'Word Count', value: result.wordCount || wordCount },
                ].map(({ label, value }) => (
                  <div key={label} className="glass" style={{ padding:'12px 16px', textAlign:'center' }}>
                    <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.75rem', marginBottom:4 }}>{label}</div>
                    <div style={{ color:'white', fontWeight:600, fontSize:'0.9rem' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Keywords */}
              {result.keywords?.length > 0 && (
                <div>
                  <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.8rem', marginBottom:10, fontWeight:500 }}>KEY INDICATORS</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {result.keywords.map(kw => (
                      <span key={kw} className="chip" style={isFake ? { background:'rgba(239,68,68,0.1)', borderColor:'rgba(239,68,68,0.2)', color:'#f87171' } : { background:'rgba(16,185,129,0.1)', borderColor:'rgba(16,185,129,0.2)', color:'#34d399' }}>{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
