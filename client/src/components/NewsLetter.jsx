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
            const res = await fetch("http://localhost:4000/api/newsletter/subscribe", {
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
            className="w-full px-6 py-24 bg-gradient-to-br from-blue-50 to-white flex flex-col items-center text-center shadow-inner"
        >
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6">
                Never Miss a Deal!
            </h1>
            <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-2xl">
                Get exclusive discounts, new arrivals, and special offers delivered straight to your inbox.
            </p>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl flex flex-col md:flex-row items-stretch gap-4"
            >
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-5 py-4 text-lg rounded-lg border border-gray-300 focus:ring-4 focus:ring-blue-300 focus:outline-none text-gray-800 shadow-sm"
                    required
                />
                <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dull transition-all text-white px-8 py-4 text-lg rounded-lg shadow-md font-semibold"
                >
                    Subscribe
                </button>
            </form>

            {error && <p className="text-red-500 mt-3">{error}</p>}
            {submitted && (
                <p className="text-green-600 mt-4 text-lg font-medium">
                    ✅ Thank you for subscribing!
                </p>
            )}
        </div>
    );
};

export default NewsLetter;
