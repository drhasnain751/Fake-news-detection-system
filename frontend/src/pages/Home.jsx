import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useAnimation } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { useCountUp } from 'react-countup';
import { useInView as useInViewObs } from 'react-intersection-observer';
import {
  Shield, Zap, Brain, BarChart3, Lock, Clock, ChevronRight,
  CheckCircle, ArrowRight, Star, AlertTriangle, TrendingUp, Globe, Search
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ─── Section: Hero ───────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', overflow:'hidden', paddingTop:80 }}>
      {/* Background orbs */}
      <div className="orb" style={{ width:600, height:600, background:'#7c3aed', top:-200, right:-150 }} />
      <div className="orb" style={{ width:400, height:400, background:'#3b82f6', bottom:-100, left:-100 }} />
      <div className="orb" style={{ width:300, height:300, background:'#06b6d4', top:'40%', left:'30%' }} />
      {/* Grid overlay */}
      <div className="bg-grid" style={{ position:'absolute', inset:0, zIndex:0 }} />

      <div className="container" style={{ position:'relative', zIndex:1 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
          {/* Left content */}
          <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.7 }}>
            <div className="chip" style={{ marginBottom:20, display:'inline-flex' }}>
              🤖 AI-Powered Fake News Detection
            </div>
            <h1 style={{ fontSize:'clamp(2.5rem, 5vw, 3.8rem)', fontWeight:800, lineHeight:1.1, marginBottom:20, color:'white' }}>
              Detect{' '}
              <span className="gradient-text">
                <TypeAnimation
                  sequence={['Fake News', 2000, 'Misinformation', 2000, 'Disinformation', 2000, 'False Claims', 2000]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </span>
              {' '}with AI Precision
            </h1>
            <p style={{ fontSize:'1.1rem', color:'rgba(255,255,255,0.6)', maxWidth:480, marginBottom:36, lineHeight:1.7 }}>
              Our advanced NLP engine and ensemble ML models analyze news articles in real-time,
              giving you instant credibility scores backed by science.
            </p>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:48 }}>
              <Link to="/signup" className="btn-primary" style={{ fontSize:'1rem', padding:'14px 32px' }}>
                Start Analyzing <ArrowRight size={18} />
              </Link>
              <Link to="/features" className="btn-secondary" style={{ fontSize:'1rem', padding:'14px 32px' }}>
                See How It Works
              </Link>
            </div>
            <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
              {[['98.7%', 'Accuracy'], ['50K+', 'Articles Analyzed'], ['<2s', 'Response Time']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontSize:'1.4rem', fontWeight:800, color:'white', fontFamily:"'Space Grotesk',sans-serif" }}>{val}</div>
                  <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.4)', marginTop:2 }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Animated card demo */}
          <motion.div initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.7, delay:0.2 }}
            style={{ position:'relative' }}
          >
            <div className="float" style={{ position:'relative' }}>
              <div className="glass-strong gradient-border" style={{ padding:28, borderRadius:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:'linear-gradient(135deg,#7c3aed,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Brain size={18} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight:600, color:'white', fontSize:'0.9rem' }}>AI Analysis Engine</div>
                    <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)' }}>Processing news article...</div>
                  </div>
                  <div style={{ marginLeft:'auto', width:8, height:8, borderRadius:'50%', background:'#10b981', animation:'pulse 1.5s infinite' }} />
                </div>
                <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:14, marginBottom:16, fontSize:'0.82rem', color:'rgba(255,255,255,0.55)', lineHeight:1.6, borderLeft:'3px solid rgba(124,58,237,0.5)' }}>
                  "Scientists discovered a breakthrough treatment that completely cures cancer using a simple household ingredient doctors don't want you to know about..."
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <span className="badge-fake">⚠ FAKE NEWS</span>
                  <span style={{ fontSize:'1.1rem', fontWeight:700, color:'#f87171' }}>94.7% Confidence</span>
                </div>
                <div className="confidence-bar" style={{ marginBottom:16 }}>
                  <div className="confidence-fill" style={{ width:'94.7%', background:'linear-gradient(90deg,#ef4444,#f87171)' }} />
                </div>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {['sensational', 'unverified claim', 'clickbait', 'conspiracy'].map(kw => (
                    <span key={kw} className="chip" style={{ fontSize:'0.7rem', background:'rgba(239,68,68,0.1)', borderColor:'rgba(239,68,68,0.2)', color:'#f87171' }}>{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating mini cards */}
            <div className="float-slow glass" style={{ position:'absolute', top:-20, right:-20, padding:'10px 16px', borderRadius:12, display:'flex', alignItems:'center', gap:8 }}>
              <CheckCircle size={16} color="#10b981" />
              <span style={{ fontSize:'0.8rem', color:'white', fontWeight:500 }}>Real-time analysis</span>
            </div>
            <div className="float-fast glass" style={{ position:'absolute', bottom:-20, left:-20, padding:'10px 16px', borderRadius:12, display:'flex', alignItems:'center', gap:8 }}>
              <Zap size={16} color="#f59e0b" />
              <span style={{ fontSize:'0.8rem', color:'white', fontWeight:500 }}>Instant results</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Sub-component for individual stat items to use the countup hook correctly
function StatItem({ value, suffix, prefix, label, color, inView }) {
  const countUpRef = useRef(null);
  const { start } = useCountUp({
    ref: countUpRef,
    start: 0,
    end: value,
    duration: 2.5,
    startOnMount: false,
    suffix: suffix || '',
    prefix: prefix || '',
  });

  useEffect(() => {
    if (inView) {
      start();
    }
  }, [inView, start]);

  return (
    <div>
      <div 
        ref={countUpRef}
        style={{ fontSize:'2.8rem', fontWeight:800, color, fontFamily:"'Space Grotesk',sans-serif", lineHeight:1, marginBottom:8 }}
      >
        {prefix}0{suffix}
      </div>
      <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.9rem' }}>{label}</div>
    </div>
  );
}

function StatsSection() {
  const { ref, inView } = useInViewObs({ threshold:0.3, triggerOnce:true });
  const stats = [
    { value: 98, suffix: '%', label: 'Detection Accuracy', color: '#10b981' },
    { value: 50000, suffix: '+', label: 'Articles Analyzed', color: '#3b82f6' },
    { value: 2, prefix: '<', suffix: 's', label: 'Avg. Response Time', color: '#a855f7' },
    { value: 99, suffix: '%', label: 'Model Uptime', color: '#f59e0b' },
  ];
  return (
    <section ref={ref} style={{ padding:'80px 0', background:'rgba(124,58,237,0.04)', borderTop:'1px solid rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, textAlign:'center' }}>
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Features ───────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    { icon: Brain, title: 'NLP Processing', desc: 'Advanced tokenization, lemmatization, and TF-IDF vectorization for deep text understanding.', color: '#a855f7' },
    { icon: Zap, title: 'Real-time Analysis', desc: 'Get instant predictions in under 2 seconds powered by our optimized ML pipeline.', color: '#3b82f6' },
    { icon: BarChart3, title: 'Confidence Scores', desc: 'Detailed probability scores from both Logistic Regression and Naive Bayes models.', color: '#06b6d4' },
    { icon: Shield, title: 'Ensemble Models', desc: 'Weighted ensemble of multiple ML models for maximum accuracy and reliability.', color: '#10b981' },
    { icon: Lock, title: 'Secure & Private', desc: 'JWT authentication, encrypted storage, and rate-limited API endpoints.', color: '#f59e0b' },
    { icon: Clock, title: 'Prediction History', desc: 'Track all your analyses with full history, search, and export capabilities.', color: '#ef4444' },
  ];

  return (
    <section className="section">
      <div className="container">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:60 }}>
          <div className="chip" style={{ marginBottom:16, display:'inline-flex' }}>✨ Powerful Features</div>
          <h2 style={{ fontSize:'clamp(2rem,4vw,2.8rem)', color:'white', marginBottom:16 }}>
            Everything you need to <span className="gradient-text">fight misinformation</span>
          </h2>
          <p style={{ maxWidth:500, margin:'0 auto', color:'rgba(255,255,255,0.5)' }}>
            A complete suite of AI tools for news verification, analysis, and reporting.
          </p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div key={title} className="card gradient-border"
              initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay: i * 0.1 }}
            >
              <div style={{ width:48, height:48, borderRadius:12, background:`${color}20`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ color:'white', fontWeight:600, fontSize:'1.05rem', marginBottom:8, marginTop:0 }}>{title}</h3>
              <p style={{ fontSize:'0.875rem', margin:0, lineHeight:1.6 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: How It Works ───────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num:'01', icon: Search, title: 'Input News Text', desc: 'Paste any news article, headline, or social media post into our analysis engine.', color: '#a855f7' },
    { num:'02', icon: Brain, title: 'NLP Preprocessing', desc: 'Our pipeline tokenizes, removes stopwords, lemmatizes, and vectorizes the text using TF-IDF.', color: '#3b82f6' },
    { num:'03', icon: Zap, title: 'ML Prediction', desc: 'Logistic Regression and Naive Bayes models analyze patterns and vote on the result.', color: '#06b6d4' },
    { num:'04', icon: BarChart3, title: 'Get Results', desc: 'Receive FAKE/REAL classification with confidence score, keywords, and detailed explanation.', color: '#10b981' },
  ];

  return (
    <section className="section" style={{ background:'rgba(5,8,20,0.5)' }}>
      <div className="container">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:60 }}>
          <div className="chip" style={{ marginBottom:16, display:'inline-flex' }}>🔄 How It Works</div>
          <h2 style={{ fontSize:'clamp(2rem,4vw,2.8rem)', color:'white', marginBottom:16 }}>
            4-step <span className="gradient-text">AI pipeline</span>
          </h2>
          <p style={{ maxWidth:500, margin:'0 auto', color:'rgba(255,255,255,0.5)' }}>
            From raw text to actionable insights in milliseconds.
          </p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, position:'relative' }}>
          {/* Connecting line */}
          <div style={{ position:'absolute', top:40, left:'12%', right:'12%', height:2, background:'linear-gradient(90deg,#7c3aed,#3b82f6,#06b6d4,#10b981)', zIndex:0, borderRadius:1 }} />
          {steps.map(({ num, icon: Icon, title, desc, color }, i) => (
            <motion.div key={num} initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay: i * 0.15 }}
              style={{ textAlign:'center', position:'relative', zIndex:1 }}
            >
              <div style={{ width:80, height:80, borderRadius:'50%', background:`linear-gradient(135deg,${color}30,${color}10)`, border:`2px solid ${color}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', position:'relative', zIndex:1 }}>
                <Icon size={28} color={color} />
                <div style={{ position:'absolute', top:-8, right:-8, width:24, height:24, borderRadius:'50%', background:color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:700, color:'white' }}>{i+1}</div>
              </div>
              <h3 style={{ color:'white', fontWeight:600, marginBottom:8, marginTop:0 }}>{title}</h3>
              <p style={{ fontSize:'0.85rem', lineHeight:1.6, margin:0 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Testimonials ──────────────────────────────────────────
function Testimonials() {
  const reviews = [
    { name:'Dr. Sarah Chen', role:'Journalism Professor', text:'FakeGuard has transformed how my students verify news sources. The NLP explanations are incredibly educational.', rating:5 },
    { name:'Mark Rodriguez', role:'Fact Checker, Reuters', text:'Impressive accuracy on our test dataset. The confidence scores align well with human fact-checking results.', rating:5 },
    { name:'Aisha Patel', role:'Media Literacy Educator', text:'Finally, a tool that explains WHY something is fake, not just that it is. The keyword highlighting is brilliant.', rating:5 },
  ];
  return (
    <section className="section">
      <div className="container">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:60 }}>
          <div className="chip" style={{ marginBottom:16, display:'inline-flex' }}>💬 Testimonials</div>
          <h2 style={{ fontSize:'clamp(2rem,4vw,2.8rem)', color:'white', marginBottom:16 }}>
            Trusted by <span className="gradient-text">researchers & journalists</span>
          </h2>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
          {reviews.map(({ name, role, text, rating }, i) => (
            <motion.div key={name} className="glass gradient-border" style={{ padding:28 }}
              initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay: i * 0.1 }}
            >
              <div style={{ display:'flex', gap:2, marginBottom:16 }}>
                {[...Array(rating)].map((_, j) => <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.9rem', lineHeight:1.7, marginBottom:20, marginTop:0 }}>"{text}"</p>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'white', fontSize:'0.9rem' }}>
                  {name[0]}
                </div>
                <div>
                  <div style={{ color:'white', fontWeight:600, fontSize:'0.875rem' }}>{name}</div>
                  <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem' }}>{role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: FAQ ────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q:'How accurate is the fake news detection?', a:'Our ensemble model achieves 94-98% accuracy on benchmark datasets. It combines Logistic Regression and Naive Bayes for best results.' },
    { q:'What type of news can it analyze?', a:'FakeGuard can analyze any English text — news articles, social media posts, blog posts, and headlines.' },
    { q:'How does the NLP pipeline work?', a:'Text goes through tokenization, stop-word removal, lemmatization, and TF-IDF vectorization before being fed to our ML models.' },
    { q:'Is my data private?', a:'Yes. All predictions are linked to your account only, stored securely, and never shared with third parties.' },
    { q:'Can I export my analysis history?', a:'Yes! You can export your full prediction history as a CSV or PDF report from the dashboard.' },
  ];
  return (
    <section className="section" style={{ background:'rgba(5,8,20,0.5)' }}>
      <div className="container" style={{ maxWidth:700 }}>
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:48 }}>
          <div className="chip" style={{ marginBottom:16, display:'inline-flex' }}>❓ FAQ</div>
          <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', color:'white' }}>
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
        </motion.div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {faqs.map(({ q, a }, i) => (
            <motion.div key={i} className="glass" initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i * 0.08 }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{
                width:'100%', background:'none', border:'none', color:'white', padding:'18px 24px',
                display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', gap:12, fontFamily:'inherit',
              }}>
                <span style={{ fontWeight:600, fontSize:'0.95rem', textAlign:'left' }}>{q}</span>
                <ChevronRight size={18} style={{ transform: open===i ? 'rotate(90deg)' : 'rotate(0deg)', transition:'transform 0.3s', flexShrink:0, color:'#a855f7' }} />
              </button>
              {open === i && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                  style={{ padding:'0 24px 18px', color:'rgba(255,255,255,0.6)', fontSize:'0.9rem', lineHeight:1.7 }}>
                  {a}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: CTA ────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="section">
      <div className="container">
        <motion.div initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
          className="glass-strong gradient-border"
          style={{ textAlign:'center', padding:'80px 40px', position:'relative', overflow:'hidden', borderRadius:24 }}
        >
          <div className="orb" style={{ width:400, height:400, background:'#7c3aed', top:-100, left:'50%', transform:'translateX(-50%)', opacity:0.12 }} />
          <div className="chip" style={{ marginBottom:20, display:'inline-flex' }}>🚀 Get Started Today</div>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', color:'white', marginBottom:16, position:'relative' }}>
            Start detecting <span className="gradient-text">fake news</span> now
          </h2>
          <p style={{ color:'rgba(255,255,255,0.55)', maxWidth:450, margin:'0 auto 36px', position:'relative' }}>
            Join thousands of users who use FakeGuard AI to verify news and combat misinformation every day.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', position:'relative' }}>
            <Link to="/signup" className="btn-primary" style={{ fontSize:'1.05rem', padding:'15px 36px' }}>
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link to="/features" className="btn-secondary" style={{ fontSize:'1.05rem', padding:'15px 36px' }}>
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main Landing Page ───────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsSection />
        <FeaturesSection />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
