import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 py-24 relative overflow-hidden transition-colors duration-500 border-t border-slate-200 dark:border-slate-800">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Company Info */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 group cursor-pointer">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Pasale</span>
              <div className="w-2 h-2 rounded-full bg-primary group-hover:animate-ping transition-all"></div>
            </div>
            <p className="text-slate-500 dark:text-slate-500 font-medium leading-relaxed max-w-sm">
              Your gateway to fresh, high-quality products. We combine the best local harvests with fast delivery to bring fresh products right to your door.
            </p>
            <div className="flex items-center gap-4">
              {['FB', 'TW', 'IG', 'LI'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xs font-black text-slate-700 dark:text-white hover:bg-primary hover:border-primary hover:text-white transition-all active:scale-95">
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Core Navigation */}
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-8">Navigation</h3>
            <ul className="space-y-4">
              {['Home', 'Products', 'Shop', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="font-semibold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-all flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-[2px] bg-primary transition-all"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions & Support */}
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-8">Support</h3>
            <ul className="space-y-4">
              {['FAQs', 'Delivery', 'Returns', 'Settings'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="font-semibold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-all flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-[1px] bg-primary dark:bg-white transition-all"></span>
                    {item === 'Returns' ? 'Returns & Policy' : item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Operational Hub */}
          <div className="space-y-8">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-8">Location</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-primary/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Our Warehouse</p>
                  <p className="text-slate-900 dark:text-white font-bold text-sm">Kathmandu, Nepal</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-500/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Email Support</p>
                  <p className="text-slate-900 dark:text-white font-bold text-sm">support@pasale.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Footer Bar */}
        <div className="mt-24 pt-12 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-400 dark:text-slate-600 text-xs font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} PASALE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-8">
            {['Privacy', 'Terms', 'Security'].map((legal) => (
              <a key={legal} href="#" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-white transition-all uppercase tracking-widest">
                {legal}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

