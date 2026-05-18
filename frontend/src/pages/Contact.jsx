import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Phone, Send } from 'lucide-react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);
  const [newsletter, setNewsletter] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    // Simulate submission
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Message sent! We\'ll get back to you within 24 hours. 📧');
    setForm({ name:'', email:'', subject:'', message:'' });
    setLoading(false);
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletter.includes('@')) { toast.error('Enter a valid email'); return; }
    toast.success('Subscribed to newsletter! 🎉');
    setNewsletter('');
  };

  const contactInfo = [
    { icon: Mail, label:'Email', value:'contact@fakeguard.ai', color:'#a855f7' },
    { icon: MapPin, label:'Location', value:'Karachi, Pakistan', color:'#3b82f6' },
    { icon: Phone, label:'Phone', value:'+92 300 1234567', color:'#10b981' },
    { icon: MessageSquare, label:'Response', value:'Within 24 hours', color:'#f59e0b' },
  ];

  const faqs = [
    { q:'Is FakeGuard free to use?', a:'Yes! Create a free account and get full access to the detection engine and dashboard.' },
    { q:'How accurate is the detection?', a:'Our ensemble model achieves 94-98% accuracy on benchmark datasets.' },
    { q:'Can I integrate via API?', a:'API integration is coming soon. Join our newsletter to be notified.' },
    { q:'What languages are supported?', a:'Currently English only. Multi-language support is on our roadmap.' },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section style={{ paddingTop:120, paddingBottom:60, position:'relative', overflow:'hidden' }}>
          <div className="orb" style={{ width:400, height:400, background:'#06b6d4', top:-150, right:-100 }} />
          <div className="bg-grid" style={{ position:'absolute', inset:0 }} />
          <div className="container" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
            <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
              <div className="chip" style={{ marginBottom:20, display:'inline-flex' }}>📬 Get In Touch</div>
              <h1 style={{ fontSize:'clamp(2.5rem,5vw,3.5rem)', color:'white', marginBottom:16 }}>
                Contact <span className="gradient-text">Us</span>
              </h1>
              <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'1.05rem', maxWidth:480, margin:'0 auto' }}>
                Have a question, feedback, or want to collaborate? We'd love to hear from you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Grid */}
        <section style={{ padding:'40px 0 80px' }}>
          <div className="container">
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:40 }}>
              {/* Info column */}
              <div>
                <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:32 }}>
                  {contactInfo.map(({ icon: Icon, label, value, color }) => (
                    <motion.div key={label} className="glass" initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                      style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 20px' }}>
                      <div style={{ width:40, height:40, borderRadius:10, background:`${color}20`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <Icon size={18} color={color} />
                      </div>
                      <div>
                        <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)', marginBottom:2 }}>{label}</div>
                        <div style={{ color:'white', fontWeight:500, fontSize:'0.9rem' }}>{value}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Social links */}
                <div style={{ marginBottom:32 }}>
                  <h3 style={{ color:'white', fontWeight:600, fontSize:'0.95rem', marginBottom:16 }}>Follow Us</h3>
                  <div style={{ display:'flex', gap:10 }}>
                    {[{ icon: FaGithub, href:'#', color:'#fff' }, { icon: FaTwitter, href:'#', color:'#1da1f2' }, { icon: FaLinkedin, href:'#', color:'#0077b5' }].map(({ icon: Icon, href, color }, i) => (
                      <a key={i} href={href} style={{ width:42, height:42, borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)', textDecoration:'none', transition:'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background=`${color}20`; e.currentTarget.style.color=color; }}
                        onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='rgba(255,255,255,0.5)'; }}>
                        <Icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div className="glass" style={{ padding:24, borderRadius:16 }}>
                  <h3 style={{ color:'white', fontWeight:600, fontSize:'0.95rem', marginBottom:6, marginTop:0 }}>Newsletter</h3>
                  <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.83rem', marginBottom:16 }}>Get updates on new features and AI research.</p>
                  <form onSubmit={handleNewsletter} style={{ display:'flex', gap:8 }}>
                    <input className="form-input" type="email" placeholder="your@email.com" value={newsletter} onChange={e => setNewsletter(e.target.value)} style={{ flex:1 }} />
                    <button type="submit" className="btn-primary" style={{ padding:'12px 16px', whiteSpace:'nowrap' }}>
                      <Send size={15} />
                    </button>
                  </form>
                </div>
              </div>

              {/* Form */}
              <motion.div className="glass-strong" initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                style={{ padding:36, borderRadius:20 }}>
                <h2 style={{ color:'white', fontWeight:700, fontSize:'1.4rem', marginBottom:6, marginTop:0 }}>Send a Message</h2>
                <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.875rem', marginBottom:28 }}>Fill out the form below and we'll respond within 24 hours.</p>
                <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    <div>
                      <label className="form-label">Name *</label>
                      <input className="form-input" type="text" placeholder="Your name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
                    </div>
                    <div>
                      <label className="form-label">Email *</label>
                      <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Subject</label>
                    <input className="form-input" type="text" placeholder="What's this about?" value={form.subject} onChange={e => setForm({...form, subject:e.target.value})} />
                  </div>
                  <div>
                    <label className="form-label">Message *</label>
                    <textarea className="form-input" rows={5} placeholder="Tell us more..." value={form.message} onChange={e => setForm({...form, message:e.target.value})} style={{ resize:'vertical' }} />
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent:'center', padding:'13px', fontSize:'0.95rem', opacity: loading ? 0.7 : 1 }}>
                    {loading ? <><div className="spinner" style={{ width:18, height:18, borderWidth:2 }} /> Sending...</> : <><Send size={16} /> Send Message</>}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding:'60px 0 80px', background:'rgba(124,58,237,0.04)', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
          <div className="container" style={{ maxWidth:700 }}>
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:40 }}>
              <h2 style={{ fontSize:'1.8rem', color:'white', marginBottom:12 }}>Quick <span className="gradient-text">FAQ</span></h2>
            </motion.div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {faqs.map(({ q, a }, i) => (
                <motion.div key={i} className="glass" initial={{ opacity:0, y:15 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i * 0.08 }}
                  style={{ padding:'20px 24px' }}>
                  <h3 style={{ color:'white', fontWeight:600, fontSize:'0.95rem', margin:'0 0 8px' }}>{q}</h3>
                  <p style={{ margin:0, fontSize:'0.875rem', lineHeight:1.6 }}>{a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
