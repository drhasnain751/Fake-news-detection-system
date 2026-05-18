import { motion } from 'framer-motion';
import { Brain, Target, Code2, Users, Building, Rocket, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const timeline = [
  { year:'Phase 1', title:'Problem Identification', desc:'Identified the growing misinformation crisis and the need for automated, accessible fake news detection tools.' },
  { year:'Phase 2', title:'Dataset Collection', desc:'Collected and preprocessed 10,000+ labeled news articles using LIAR, FakeNewsNet, and custom web-scraped datasets.' },
  { year:'Phase 3', title:'NLP Pipeline Design', desc:'Built preprocessing pipeline with NLTK: tokenization, lemmatization, TF-IDF vectorization with n-gram range 1-2.' },
  { year:'Phase 4', title:'Model Training', desc:'Trained Logistic Regression and Naive Bayes models, achieving 94-98% accuracy on test sets via cross-validation.' },
  { year:'Phase 5', title:'Full Stack Development', desc:'Built MERN stack platform with React + Vite frontend, Node.js backend, MongoDB database, and Flask ML API.' },
  { year:'Phase 6', title:'Deployment & Testing', desc:'Deployed on Vercel (frontend), Render (backend), and Railway (ML service) with CI/CD pipelines.' },
];

const team = [
  { name:'Ahmed Raza', role:'ML Engineer & Backend', init:'A', color:'#7c3aed' },
  { name:'Fatima Khan', role:'Frontend Developer', init:'F', color:'#3b82f6' },
  { name:'Bilal Hassan', role:'NLP Specialist', init:'B', color:'#10b981' },
  { name:'Sara Ahmed', role:'UI/UX Designer', init:'S', color:'#f59e0b' },
];

export default function About() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section style={{ paddingTop:120, paddingBottom:80, position:'relative', overflow:'hidden' }}>
          <div className="orb" style={{ width:500, height:500, background:'#3b82f6', top:-150, left:-100 }} />
          <div className="bg-grid" style={{ position:'absolute', inset:0 }} />
          <div className="container" style={{ position:'relative', zIndex:1 }}>
            <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} style={{ maxWidth:680 }}>
              <div className="chip" style={{ marginBottom:20, display:'inline-flex' }}>🎓 Final Year Project</div>
              <h1 style={{ fontSize:'clamp(2.5rem,5vw,3.5rem)', color:'white', marginBottom:20 }}>
                About <span className="gradient-text">FakeGuard AI</span>
              </h1>
              <p style={{ fontSize:'1.1rem', color:'rgba(255,255,255,0.6)', lineHeight:1.7 }}>
                FakeGuard is an AI-powered fake news detection platform developed as a Final Year Project.
                It combines modern NLP techniques with machine learning to tackle one of the most pressing
                issues of our time — misinformation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Problem Statement */}
        <section style={{ padding:'64px 0', background:'rgba(239,68,68,0.04)', borderTop:'1px solid rgba(239,68,68,0.1)', borderBottom:'1px solid rgba(239,68,68,0.1)' }}>
          <div className="container">
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
              <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
                <h2 style={{ fontSize:'2.2rem', color:'white', marginBottom:16 }}>The <span style={{ color:'#ef4444' }}>Problem</span></h2>
                <p style={{ color:'rgba(255,255,255,0.6)', lineHeight:1.7, marginBottom:16 }}>
                  Fake news spreads 6x faster than real news on social media (MIT Study, 2018). Misinformation
                  has influenced elections, public health decisions, and created social division globally.
                </p>
                <p style={{ color:'rgba(255,255,255,0.6)', lineHeight:1.7 }}>
                  Manual fact-checking cannot scale to the volume of content published daily. We need
                  automated, accessible tools that can assist journalists, educators, and everyday citizens
                  in identifying misinformation quickly and accurately.
                </p>
              </motion.div>
              <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {[
                    { stat:'6x', label:'Faster spread of fake vs real news', color:'#ef4444' },
                    { stat:'75%', label:'Americans encountered fake news', color:'#f59e0b' },
                    { stat:'$78B', label:'Yearly cost of misinformation', color:'#3b82f6' },
                  ].map(({ stat, label, color }) => (
                    <div key={stat} className="glass" style={{ padding:'20px 24px', display:'flex', alignItems:'center', gap:20 }}>
                      <div style={{ fontSize:'2.2rem', fontWeight:800, color, fontFamily:"'Space Grotesk',sans-serif", lineHeight:1 }}>{stat}</div>
                      <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.9rem' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section style={{ padding:'80px 0' }}>
          <div className="container">
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:48 }}>
              <h2 style={{ fontSize:'2rem', color:'white', marginBottom:12 }}>System <span className="gradient-text">Architecture</span></h2>
            </motion.div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, alignItems:'start' }}>
              {[
                { icon: Code2, title:'Frontend Layer', color:'#3b82f6', items:['React 18 + Vite 5','Tailwind CSS v4','Framer Motion','Recharts Analytics','React Router v6'] },
                { icon: Target, title:'Backend Layer', color:'#10b981', items:['Node.js + Express','MongoDB Atlas','JWT Authentication','REST API Design','Rate Limiting'] },
                { icon: Brain, title:'ML Service Layer', color:'#a855f7', items:['Python Flask 3.0','Scikit-learn Models','NLTK NLP Pipeline','TF-IDF Vectorizer','Ensemble Prediction'] },
              ].map(({ icon: Icon, title, color, items }, i) => (
                <motion.div key={title} className="card gradient-border" initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i * 0.1 }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:`${color}20`, border:`1px solid ${color}40`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                    <Icon size={22} color={color} />
                  </div>
                  <h3 style={{ color:'white', fontWeight:700, marginBottom:16, marginTop:0 }}>{title}</h3>
                  {items.map(item => (
                    <div key={item} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, fontSize:'0.875rem', color:'rgba(255,255,255,0.55)' }}>
                      <ChevronRight size={13} color={color} /> {item}
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section style={{ padding:'80px 0', background:'rgba(124,58,237,0.04)' }}>
          <div className="container" style={{ maxWidth:800 }}>
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:56 }}>
              <h2 style={{ fontSize:'2rem', color:'white', marginBottom:12 }}>Project <span className="gradient-text">Timeline</span></h2>
            </motion.div>
            <div style={{ position:'relative' }}>
              <div style={{ position:'absolute', left:20, top:0, bottom:0, width:2, background:'linear-gradient(180deg,#7c3aed,#3b82f6,#06b6d4)' }} />
              {timeline.map(({ year, title, desc }, i) => (
                <motion.div key={i} initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay: i * 0.1 }}
                  style={{ display:'flex', gap:24, marginBottom:32, paddingLeft:56, position:'relative' }}>
                  <div style={{ position:'absolute', left:8, top:4, width:26, height:26, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:700, color:'white', flexShrink:0 }}>{i+1}</div>
                  <div>
                    <div style={{ fontSize:'0.75rem', color:'#a855f7', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>{year}</div>
                    <h3 style={{ color:'white', fontWeight:600, marginBottom:6, marginTop:0 }}>{title}</h3>
                    <p style={{ margin:0, fontSize:'0.875rem', lineHeight:1.6 }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section style={{ padding:'80px 0' }}>
          <div className="container">
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:48 }}>
              <h2 style={{ fontSize:'2rem', color:'white', marginBottom:12 }}>Meet the <span className="gradient-text">Team</span></h2>
              <p style={{ color:'rgba(255,255,255,0.5)' }}>Computer Science students passionate about AI and truth</p>
            </motion.div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
              {team.map(({ name, role, init, color }, i) => (
                <motion.div key={name} className="card" initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i * 0.1 }}
                  style={{ textAlign:'center', padding:'32px 20px' }}>
                  <div style={{ width:64, height:64, borderRadius:'50%', background:`linear-gradient(135deg,${color},${color}aa)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'1.4rem', fontWeight:700, color:'white', fontFamily:"'Space Grotesk',sans-serif" }}>{init}</div>
                  <h3 style={{ color:'white', fontWeight:600, fontSize:'0.95rem', margin:'0 0 6px' }}>{name}</h3>
                  <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.8rem', margin:0 }}>{role}</p>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', marginTop:40 }}>
              <div className="glass" style={{ display:'inline-flex', alignItems:'center', gap:12, padding:'16px 28px', borderRadius:16 }}>
                <Building size={20} color="#a855f7" />
                <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.9rem' }}>
                  Department of Computer Science · University of Technology · Batch 2024
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Future */}
        <section style={{ padding:'80px 0', background:'rgba(124,58,237,0.04)', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
          <div className="container">
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:48 }}>
              <h2 style={{ fontSize:'2rem', color:'white', marginBottom:12 }}>Future <span className="gradient-text">Enhancements</span></h2>
            </motion.div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
              {[
                { icon:'🌍', title:'Multi-language Support', desc:'Extend detection to Urdu, Arabic, Hindi, and 20+ languages using multilingual BERT.' },
                { icon:'🐦', title:'Social Media Integration', desc:'Direct integration with Twitter/X, Facebook API for real-time feed analysis.' },
                { icon:'🔗', title:'Browser Extension', desc:'Chrome extension for one-click verification of news articles while browsing.' },
                { icon:'🧠', title:'BERT/Transformer Models', desc:'Upgrade from TF-IDF to BERT embeddings for 99%+ accuracy on complex articles.' },
                { icon:'📱', title:'Mobile App', desc:'React Native mobile app for on-the-go news verification on iOS and Android.' },
                { icon:'📊', title:'Public API', desc:'Monetizable REST API with usage tiers for developers and organizations.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="glass" style={{ padding:'24px 20px' }}>
                  <div style={{ fontSize:'2rem', marginBottom:12 }}>{icon}</div>
                  <h3 style={{ color:'white', fontWeight:600, fontSize:'0.95rem', margin:'0 0 8px' }}>{title}</h3>
                  <p style={{ margin:0, fontSize:'0.83rem', lineHeight:1.6 }}>{desc}</p>
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
