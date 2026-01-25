import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="pb-24 bg-white dark:bg-slate-900 transition-colors duration-500">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 py-24 px-6 text-center relative overflow-hidden transition-colors duration-500">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] -mr-64 -mt-64"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] -ml-64 -mb-64"></div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter italic">Always Fresh</h1>
                </div>
            </div>


            <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
                {/* Mission Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="premium-card p-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 group hover:bg-primary dark:hover:bg-primary transition-all duration-500">
                        <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-10 transform rotate-3 group-hover:bg-white/20 transition-colors">
                            <svg className="w-8 h-8 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4 uppercase tracking-tight group-hover:text-white transition-colors">Quality First</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed group-hover:text-white/80 transition-colors">Every product undergoes thorough checks to ensure maximum freshness and top-tier quality for our customers.</p>
                    </div>
                    <div className="premium-card p-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 group hover:bg-blue-500 dark:hover:bg-blue-500 transition-all duration-500">
                        <div className="w-16 h-16 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mb-10 transform -rotate-3 group-hover:bg-white/20 transition-colors">
                            <svg className="w-8 h-8 text-blue-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4 uppercase tracking-tight group-hover:text-white transition-colors">Local Farmers</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed group-hover:text-white/80 transition-colors">We work directly with local farmers to bring you fresh produce while supporting our community's cooperatives.</p>
                    </div>
                    <div className="premium-card p-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 group hover:bg-emerald-500 dark:hover:bg-emerald-500 transition-all duration-500">
                        <div className="w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-10 transform rotate-6 group-hover:bg-white/20 transition-colors">
                            <svg className="w-8 h-8 text-emerald-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4 uppercase tracking-tight group-hover:text-white transition-colors">Fast Delivery</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed group-hover:text-white/80 transition-colors">Our efficient logistics team ensures your order reaches your doorstep in the shortest possible time.</p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border border-slate-200 dark:border-slate-700 transition-colors duration-500">
                    <div>
                        <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">50+</p>
                        <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-[0.2em]">Partner Farms</p>
                    </div>
                    <div>
                        <p className="text-4xl md:text-5xl font-black text-primary mb-2">12K</p>
                        <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-[0.2em]">Happy Customers</p>
                    </div>
                    <div>
                        <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">100%</p>
                        <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-[0.2em]">Quality Assurance</p>
                    </div>
                    <div>
                        <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">24h</p>
                        <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-[0.2em]">Average Delivery</p>
                    </div>
                </div>

                {/* Story Section */}
                <div className="mt-24 flex flex-col items-center gap-16">
                    <div className="text-center max-w-3xl">
                        <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-4 inline-block">Established 2024</span>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter uppercase italic">Our Story</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-lg">
                            Founded in the heart of Kathmandu, Pasale emerged from a simple idea: making fresh groceries accessible to everyone. We saw the challenges in the traditional supply chain and decided to build a better way to connect farmers with consumers.
                        </p>
                    </div>
                    <div className="w-full h-[350px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl relative group">
                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-all duration-700 z-10"></div>
                        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" alt="Our Store" />
                    </div>
                </div>

                {/* Final Call - Light mode friendly */}
                <div className="mt-32 p-12 md:p-24 bg-gradient-to-br from-primary to-primary-dark rounded-[4rem] text-center relative overflow-hidden shadow-2xl shadow-primary/20">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -mr-80 -mt-80"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-7xl font-black text-white mb-8 uppercase tracking-tighter italic">Join Our Community</h2>
                        <p className="text-white/80 max-w-xl mx-auto mb-12 font-medium text-lg leading-relaxed">
                            Experience the difference with a marketplace that values freshness, sustainability, and supporting our local community.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-block px-16 py-6 bg-white text-primary font-black rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-xl active:scale-95 uppercase tracking-widest text-sm"
                        >
                            Get In Touch
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default About;
