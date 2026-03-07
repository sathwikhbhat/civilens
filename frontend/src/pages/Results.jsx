import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ArrowRight, CheckCircle, ExternalLink, GraduationCap, HeartPulse, Building2, UserCircle, Briefcase, X, Loader2 } from 'lucide-react';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get data passed from the PersonaBuilder API response
    const personaData = location.state?.persona || null;
    const dynamicallyMatchedSchemes = location.state?.schemes || [];

    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedSchemeForApply, setSelectedSchemeForApply] = useState(null);
    const [isIframeLoading, setIsIframeLoading] = useState(true);

    useEffect(() => {
        const handleMessage = (event) => {
            // Check for the specific form submission action sent by the iframe
            if (event.data?.action === 'FORM_SUBMITTED') {
                console.log("Application via iframe submitted:", event.data);
                alert("Application Auto-Filled & Submitted Successfully!");
                setSelectedSchemeForApply(null); // Close the modal
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Derive categories dynamically from properties
    const availableCategories = ['All', ...new Set(dynamicallyMatchedSchemes.map(s => s.category).filter(Boolean))];

    const filteredSchemes = activeFilter === 'All'
        ? dynamicallyMatchedSchemes
        : dynamicallyMatchedSchemes.filter(s => s.category === activeFilter);

    const getIconForCategory = (category) => {
        switch (category?.toUpperCase()) {
            case 'HEALTHCARE': return <HeartPulse className="text-rose-500 w-6 h-6" />;
            case 'EDUCATION': return <GraduationCap className="text-primary-500 w-6 h-6" />;
            case 'FINANCIAL': return <Building2 className="text-saffron-500 w-6 h-6" />;
            case 'FARMER': return <Building2 className="text-india-green-500 w-6 h-6" />;
            case 'STUDENT': return <GraduationCap className="text-primary-500 w-6 h-6" />;
            case 'WORKER': return <Briefcase className="text-slate-600 w-6 h-6" />;
            default: return <UserCircle className="text-slate-500 w-6 h-6" />;
        }
    };

    // If page is accessed directly without navigating through form first
    if (!personaData || !dynamicallyMatchedSchemes.length === 0) {
        return (
            <div className="pt-32 pb-16 flex-1 flex flex-col items-center justify-center bg-slate-50 min-h-screen text-center px-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">No results found or direct access detected</h2>
                <p className="text-slate-500 mb-8">Please build your persona to find eligible schemes.</p>
                <button onClick={() => navigate('/form')} className="bg-primary-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-primary-700 transition-colors">
                    Go to Persona Builder
                </button>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 flex-1 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
                                We found <span className="text-primary-600">{dynamicallyMatchedSchemes.length} schemes</span> for you
                            </h1>
                            <p className="text-slate-600">
                                Powered by our AI matching engine based on your {personaData?.occupation?.type || 'provided'} persona profile.
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 min-w-max"
                    >
                        <Filter size={18} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">Filter:</span>
                        <select
                            className="bg-transparent text-sm font-bold text-slate-900 outline-none cursor-pointer p-1"
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value)}
                        >
                            {availableCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </motion.div>
                </div>

                {/* Results Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSchemes.map((scheme, idx) => (
                        <motion.div
                            key={scheme.id || idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        {getIconForCategory(scheme.category)}
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-india-green-500/10 text-india-green-600 border border-india-green-500/20">
                                        <CheckCircle size={14} /> Highly Matched
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-2">{scheme.title}</h3>
                                <p className="text-slate-600 text-sm mb-4 flex-1 line-clamp-3 leading-relaxed">{scheme.summary || scheme.description}</p>

                                <div className="flex flex-wrap gap-2 mt-auto">
                                    <span className="px-2.5 py-1 bg-primary-50 text-primary-700 border border-primary-100 text-xs font-semibold rounded-md">
                                        {scheme.applicationMode ? `Mode: ${scheme.applicationMode}` : scheme.category}
                                    </span>
                                    {scheme.benefits && (
                                        <span className="px-2.5 py-1 bg-saffron-500/10 text-saffron-600 border border-saffron-500/20 text-xs font-semibold rounded-md line-clamp-1 max-w-[200px]">
                                            {typeof scheme.benefits === 'string' ? scheme.benefits : scheme.benefits?.description || scheme.benefits?.type}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50/50 flex items-center justify-between">
                                <button className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
                                    Details
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedSchemeForApply(scheme);
                                        setIsIframeLoading(true);
                                    }}
                                    className="flex items-center gap-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                                >
                                    Apply Now <ExternalLink size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredSchemes.length === 0 && dynamicallyMatchedSchemes.length > 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-medium text-slate-900 mb-2">No schemes found in this category</h3>
                        <p className="text-slate-500">Try changing the filter.</p>
                    </div>
                )}

            </div>

            {/* Application Iframe Modal */}
            <AnimatePresence>
                {selectedSchemeForApply && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{selectedSchemeForApply.title}</h3>
                                    <p className="text-xs font-medium text-primary-600">Auto-fill Application Form</p>
                                </div>
                                <button
                                    onClick={() => setSelectedSchemeForApply(null)}
                                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body (Iframe) */}
                            <div className="relative flex-1 bg-slate-50">
                                {isIframeLoading && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                                        <p className="text-sm font-medium text-slate-500">Connecting to secure form portal...</p>
                                    </div>
                                )}
                                <iframe
                                    src="https://forms-o608u42it-ritviklm16-7532s-projects.vercel.app/"
                                    title="Application Form"
                                    className="w-full h-full border-0"
                                    onLoad={() => setIsIframeLoading(false)}
                                    allow="camera; microphone"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Results;
