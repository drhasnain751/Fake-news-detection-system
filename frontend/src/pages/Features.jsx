import { motion } from 'framer-motion';
import { Brain, Zap, BarChart3, Shield, Lock, Clock, Database, Key, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const features = [
  {
    icon: Brain, title: 'Fake News Detection', color: '#a855f7',
    desc: 'Powered by an ensemble of Logistic Regression and Naive Bayes ML models trained on thousands of news articles.',
    points: ['Dual-model ensemble voting', 'Confidence scoring 0-100%', 'FAKE/REAL classification', 'Keyword extraction'],
  },
  {
    icon: Zap, title: 'NLP Processing Pipeline', color: '#3b82f6',
    desc: 'Advanced natural language processing pipeline that understands the linguistic patterns of misinformation.',
    points: ['NLTK tokenization', 'Stop-word removal', 'WordNet lemmatization', 'TF-IDF vectorization (n-gram 1-2)'],
  },
  {
    icon: BarChart3, title: 'Real-time Analysis', color: '#06b6d4',
    desc: 'Submit any article and receive instant results — typically in under 2 seconds from our optimized Flask API.',
    points: ['<2 second response time', 'Live confidence meter', 'Processing animations', 'Batch analysis support'],
  },
  {
    icon: CheckCircle, title: 'AI Confidence Score', color: '#10b981',
    desc: 'Granular probability scores from each model combined into a weighted ensemble confidence percentage.',
    points: ['Per-model breakdown', 'Ensemble weighting (60/40)', 'Visual confidence bar', 'Reliability indicator'],
  },
  {
    icon: Database, title: 'Dataset Monitoring', color: '#f59e0b',
    desc: 'Admin tools for uploading training datasets, monitoring model performance, and triggering retraining.',
    points: ['CSV dataset upload', 'Dataset statistics', 'Model accuracy tracking', 'One-click retraining'],
  },
  {
    icon: Clock, title: 'Prediction History', color: '#ec4899',
    desc: 'Full history of all your analyses with search, filter, date sorting, and export capabilities.',
    points: ['Searchable history', 'Filter by FAKE/REAL', 'Date/time sorting', 'CSV & PDF export'],
  },
  {
    icon: Shield, title: 'Admin Controls', color: '#8b5cf6',
    desc: 'Comprehensive admin panel for managing users, predictions, datasets, and monitoring system health.',
    points: ['User management', 'Role-based access', 'Platform analytics', 'API log monitoring'],
  },
  {
    icon: Key, title: 'API Security', color: '#f97316',
    desc: 'Enterprise-grade security with JWT authentication, rate limiting, helmet.js, and input validation.',
    points: ['JWT auth tokens', 'Rate limiting (100/15min)', 'Helmet.js headers', 'Input sanitization'],
  },
];

export default function Features() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section style={{ paddingTop:120, paddingBottom:80, position:'relative', overflow:'hidden' }}>
          <div className="orb" style={{ width:500, height:500, background:'#7c3aed', top:-200, right:-100 }} />
          <div className="bg-grid" style={{ position:'absolute', inset:0 }} />
          <div className="container" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
            <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
              <div className="chip" style={{ marginBottom:20, display:'inline-flex' }}>⚡ Platform Features</div>
              <h1 style={{ fontSize:'clamp(2.5rem,5vw,3.5rem)', color:'white', marginBottom:20 }}>
                Built for <span className="gradient-text">truth-seekers</span>
              </h1>
              <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'1.1rem', maxWidth:560, margin:'0 auto' }}>
                A complete AI platform with everything you need to detect, analyze, and understand fake news at scale.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Feature Grid */}
        <section style={{ paddingBottom:100 }}>
          <div className="container">
            <div className="features-container-grid">
              {features.map(({ icon: Icon, title, color, desc, points }, i) => (
                <motion.div key={title} className="card gradient-border"
                  initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }} transition={{ delay: i * 0.07 }}
                  style={{ padding:32 }}
                >
                  <div style={{ display:'flex', alignItems:'flex-start', gap:18, marginBottom:20 }}>
                    <div style={{ width:52, height:52, borderRadius:14, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Icon size={24} color={color} />
                    </div>
                    <div>
                      <h3 style={{ color:'white', fontWeight:700, fontSize:'1.1rem', margin:'0 0 6px' }}>{title}</h3>
                      <p style={{ margin:0, fontSize:'0.875rem', lineHeight:1.6 }}>{desc}</p>
                    </div>
                  </div>
                  <div className="feature-points-grid">
                    {points.map(pt => (
                      <div key={pt} style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.8rem', color:'rgba(255,255,255,0.55)' }}>
                        <div style={{ width:5, height:5, borderRadius:'50%', background:color, flexShrink:0 }} />
                        {pt}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section style={{ padding:'80px 0', background:'rgba(124,58,237,0.04)', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
          <div className="container">
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:48 }}>
              <h2 style={{ fontSize:'2rem', color:'white', marginBottom:12 }}>Tech <span className="gradient-text">Stack</span></h2>
              <p style={{ color:'rgba(255,255,255,0.5)' }}>Enterprise-grade technologies powering FakeGuard</p>
            </motion.div>
            <div className="tech-stack-grid">
              {[
                { name:'React + Vite', role:'Frontend', color:'#06b6d4' },
                { name:'Tailwind CSS', role:'Styling', color:'#3b82f6' },
                { name:'Framer Motion', role:'Animations', color:'#a855f7' },
                { name:'Node.js + Express', role:'Backend API', color:'#10b981' },
                { name:'MongoDB Atlas', role:'Database', color:'#f59e0b' },
                { name:'Python Flask', role:'ML Service', color:'#ef4444' },
                { name:'Scikit-learn', role:'ML Models', color:'#ec4899' },
                { name:'JWT + Bcrypt', role:'Security', color:'#8b5cf6' },
              ].map(({ name, role, color }) => (
                <div key={name} className="glass" style={{ padding:'16px 20px', textAlign:'center' }}>
                  <div style={{ fontSize:'0.78rem', color, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>{role}</div>
                  <div style={{ color:'white', fontWeight:600, fontSize:'0.9rem' }}>{name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
