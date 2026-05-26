import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, LayoutGrid, Menu, X, Globe } from 'lucide-react';

const Navbar = ({ onNavigateToLogin, onNavigateToRegister, onNavigateToDashboard, isAuthenticated }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav 
            className={`navbar ${scrolled ? 'scrolled' : ''}`}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderBottom: scrolled ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                padding: '1rem 2rem'
            }}
        >
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}>
                <div 
                    className="nav-logo" 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                >
                    <div style={{ width: '120px', height: '40px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '4px' }}>
                        <img src="/src/assets/logo.png" alt="Logo" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: scrolled ? 'var(--text-primary)' : 'white' }}>
                        Attend<span style={{ color: scrolled ? 'var(--primary-color)' : 'white' }}>Flow</span>
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <a 
                        href="https://sgpbellary.com/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ 
                            color: scrolled ? 'var(--text-primary)' : 'white', 
                            textDecoration: 'none', 
                            fontWeight: 600, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            opacity: 0.8,
                            fontSize: '0.95rem'
                        }}
                    >
                        <Globe size={18} />
                        Official Site
                    </a>
                    {isAuthenticated ? (
                        <button 
                            onClick={onNavigateToDashboard}
                            className="btn btn-primary"
                            style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}
                        >
                            <LayoutGrid size={18} />
                            Dashboard
                        </button>
                    ) : (
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={onNavigateToLogin}
                                style={{ color: scrolled ? 'var(--text-primary)' : 'white', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={onNavigateToRegister}
                                className="btn btn-primary"
                                style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}
                            >
                                <LogIn size={18} />
                                Get Started
                            </button>
                        </div>
                    )}
                </div>

                <button 
                    className="md:hidden" 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{ background: 'none', border: 'none', color: scrolled ? 'var(--text-primary)' : 'white' }}
                >
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', padding: '1rem', boxShadow: 'var(--shadow-lg)' }}
                >
                    <div className="flex flex-col gap-4">
                        <a 
                            href="https://sgpbellary.com/" 
                            className="bg-gray-50 flex items-center gap-3 p-3 rounded-xl no-underline font-semibold"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            <Globe size={20} />
                            Official Institutional Site
                        </a>
                        {isAuthenticated ? (
                            <button onClick={onNavigateToDashboard} className="btn btn-primary w-full">Dashboard</button>
                        ) : (
                            <>
                                <button onClick={onNavigateToLogin} className="btn btn-secondary w-full">Sign In</button>
                                <button onClick={onNavigateToRegister} className="btn btn-primary w-full">Get Started</button>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </nav>
    );
};
export default Navbar;
