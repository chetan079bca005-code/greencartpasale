import React, { useState } from 'react';

const NewsLetter = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/newsletter/subscribe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                setSubmitted(true);
                setEmail('');
                setError('');
            } else {
                setError(result.message || 'Something went wrong. Please try again.');
                setSubmitted(false);
            }
        } catch (err) {
            console.error(err);
            setError('Server error. Please try again later.');
            setSubmitted(false);
        }
    };

    return (
        <div
            id="newsletter"
            className="w-full px-6 py-16 flex flex-col items-center text-center relative overflow-hidden"
        >
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

            <div className="relative z-10 max-w-4xl w-full">
                <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-4 inline-block">Join our community</span>
                <h1 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white mb-6 tracking-tight">
                    Stay Fresh. <span className="text-primary">Never Miss a Deal.</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                    Get the latest harvests and exclusive offers delivered straight to your inbox every week.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-xl mx-auto relative group"
                >
                    <div className="flex flex-col md:flex-row items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 focus-within:border-primary/50 transition-all">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email address..."
                            className="flex-1 px-4 py-3 text-slate-700 dark:text-white bg-transparent focus:outline-none w-full placeholder-slate-400"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full md:w-auto px-10 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 active:scale-95"
                        >
                            Subscribe Now
                        </button>
                    </div>
                </form>

                <div className="flex justify-center gap-8 mt-12 text-slate-500 dark:text-slate-400 font-medium text-sm">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                        Weekly Updates
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                        Spam Free
                    </div>
                </div>

                {error && <p className="text-red-500 mt-6 font-medium animate-shake">{error}</p>}
                {submitted && (
                    <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-2xl border border-green-100 dark:border-green-800 animate-fadeIn">
                        ✅ Success! You're on the list.
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsLetter;
