import React from 'react';

const About = () => {
    return (
        <div className="pt-24 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">About Pasale</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Your trusted partner in bringing fresh, high-quality products to your doorstep.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="mb-16">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-gray-600 mb-6">
                            At Pasale, we are committed to providing our customers with the freshest and highest quality products while supporting local farmers and producers. We believe in sustainable practices and ensuring that every product we deliver meets our strict quality standards.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Quality Assurance</h3>
                                <p className="text-gray-600">We carefully select and verify each product to ensure the highest quality standards.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Local Support</h3>
                                <p className="text-gray-600">We work directly with local farmers and producers to support our community.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Fast Delivery</h3>
                                <p className="text-gray-600">We ensure quick and reliable delivery to maintain product freshness.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Story Section */}
                <div className="mb-16">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
                        <p className="text-gray-600 mb-6">
                            Founded in 2024, Pasale began with a simple idea: to make fresh, high-quality products easily accessible to everyone in Nepal. What started as a small local initiative has grown into a trusted platform connecting local producers with customers across the country.
                        </p>
                        <p className="text-gray-600">
                            Today, we continue to expand our reach while staying true to our core values of quality, sustainability, and community support. We're proud to serve our customers and contribute to the growth of local agriculture and small businesses.
                        </p>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
                    <p className="text-gray-600 mb-6">
                        Have questions or feedback? We'd love to hear from you.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dull transition-colors duration-200"
                    >
                        Contact Us
                    </a>
                </div>
            </div>
        </div>
    );
};

export default About; 