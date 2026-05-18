import { Link } from 'react-router-dom';
import { Shield, Mail } from 'lucide-react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const footerLinks = {
  Product: [
    { label: 'Features', to: '/features' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'API Docs', to: '#' },
    { label: 'Pricing', to: '#' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Blog', to: '#' },
    { label: 'Careers', to: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Service', to: '#' },
    { label: 'Cookie Policy', to: '#' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background:'#020409', borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:64, paddingBottom:32 }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:48, marginBottom:48 }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', marginBottom:16 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Shield size={18} color="white" />
              </div>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'1.05rem', color:'white' }}>
                Fake<span style={{ color:'#a855f7' }}>Guard</span>
              </span>
            </Link>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.875rem', lineHeight:1.7, maxWidth:280, marginBottom:24 }}>
              AI-powered fake news detection platform. Protecting truth with machine learning and NLP technology.
            </p>
            <div style={{ display:'flex', gap:12 }}>
              {[
                { icon: FaGithub, href: '#' },
                { icon: FaTwitter, href: '#' },
                { icon: FaLinkedin, href: '#' },
                { icon: Mail, href: 'mailto:contact@fakeguard.ai' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} style={{
                  width:36, height:36, borderRadius:8, background:'rgba(255,255,255,0.06)',
                  border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center',
                  color:'rgba(255,255,255,0.5)', transition:'all 0.2s', textDecoration:'none',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(124,58,237,0.2)'; e.currentTarget.style.color='white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='rgba(255,255,255,0.5)'; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ color:'white', fontWeight:600, fontSize:'0.9rem', marginBottom:16, marginTop:0 }}>{title}</h4>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:10 }}>
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} style={{
                      color:'rgba(255,255,255,0.45)', fontSize:'0.875rem', textDecoration:'none',
                      transition:'color 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.color='rgba(168,85,247,0.9)'}
                      onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.45)'}
                    >{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:24, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.82rem', margin:0 }}>
            © 2024 FakeGuard AI. All rights reserved. Built with ❤️ for Final Year Project.
          </p>
          <div style={{ display:'flex', gap:4 }}>
            {['ML Powered', 'NLP Engine', 'Real-time'].map(tag => (
              <span key={tag} className="chip" style={{ fontSize:'0.72rem' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
