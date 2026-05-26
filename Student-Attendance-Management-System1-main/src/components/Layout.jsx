import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutGrid,
    Activity,
    FileBarChart,
    ClipboardList,
    Users,
    LogOut,
    ShieldCheck,
    Settings,
    UserCheck,
    Calendar,
    Menu,
    X,
    Bell,
    User,
    Home,
    Search,
    Trash2,
    Book
} from 'lucide-react';

const Layout = ({ children, activeTab, setActiveTab, logout, user, onDeleteAccount, searchQuery, setSearchQuery }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const role = user?.role || 'STUDENT';

    const notifications = [
        { id: 1, title: 'New Attendance Registry', time: '2 mins ago', type: 'info', description: 'Faculty added new records for DCS-A' },
        { id: 2, title: 'Leave Approval', time: '1 hour ago', type: 'success', description: 'HOD approved your leave application' },
        { id: 3, title: 'System Maintenance', time: '5 hours ago', type: 'warning', description: 'DB sync scheduled at 02:00 UTC' }
    ];

    const navItems = {
        ADMIN: [
            { id: 'admin-dashboard', label: 'Admin Hub', icon: <ShieldCheck size={20} /> },
            { id: 'students', label: 'Student Directory', icon: <Users size={20} /> },
            { id: 'reports', label: 'System Reports', icon: <FileBarChart size={20} /> },
            { id: 'curriculum', label: 'Curriculum Hub', icon: <Book size={20} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
            { id: 'profile', label: 'My Identity', icon: <User size={20} /> },
        ],
        HOD: [
            { id: 'hod-dashboard', label: 'Overview', icon: <Home size={20} /> },
            { id: 'dashboard', label: 'Attendance Hub', icon: <LayoutGrid size={20} /> },
            { id: 'leave', label: 'Leave Gateway', icon: <ClipboardList size={20} /> },
            { id: 'curriculum', label: 'Curriculum', icon: <Book size={20} /> },
            { id: 'reports', label: 'Analytics', icon: <Activity size={20} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
            { id: 'profile', label: 'My Identity', icon: <User size={20} /> },
        ],
        TEACHER: [
            { id: 'faculty-dashboard', label: 'Faculty Dashboard', icon: <Home size={20} /> },
            { id: 'faculty-attendance', label: 'Faculty Attendance Entry', icon: <UserCheck size={20} /> },
            { id: 'leave', label: 'Leave Requests', icon: <ClipboardList size={20} /> },
            { id: 'curriculum', label: 'Curriculum Hub', icon: <Book size={20} /> },
            { id: 'reports', label: 'Class Analytics', icon: <FileBarChart size={20} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
            { id: 'profile', label: 'Account Settings', icon: <User size={20} /> },
        ],
        STUDENT: [
            { id: 'student-dashboard', label: 'My Terminal', icon: <Home size={20} /> },
            { id: 'schedule', label: 'Academic Routine', icon: <Calendar size={20} /> },
            { id: 'curriculum', label: 'Curriculum', icon: <Book size={20} /> },
            { id: 'leave', label: 'Leave Application', icon: <ClipboardList size={20} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
            { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
        ]
    };

    const currentNav = navItems[role] || navItems.STUDENT;

    return (
        <div className="app-container">
            {/* Sidebar Toggle Button (Visible on all screens) */}
            <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 60 }}>
                {/* Offset Gradient Shadow */}
                <div style={{ position: 'absolute', top: 6, left: 6, width: '100%', height: '100%', background: 'var(--primary-gradient)', borderRadius: '14px', zIndex: -1 }}></div>
                
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    style={{ 
                        position: 'relative',
                        padding: '12px', 
                        background: 'white', 
                        borderRadius: '14px', 
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        outline: 'none',
                        color: 'black'
                    }}
                >
                    <AnimatePresence mode="wait">
                        {isSidebarOpen ? (
                            <motion.div
                                key="close"
                                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                                style={{ display: 'flex' }}
                            >
                                <X size={24} strokeWidth={2.5} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                                style={{ display: 'flex' }}
                            >
                                <Menu size={24} strokeWidth={2.5} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`sidebar ${!isSidebarOpen ? 'closed' : 'mobile-active'}`}>
                <div className="brand-logo" style={{ paddingLeft: '80px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--primary-gradient)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', minWidth: '40px' }}>
                        <Activity size={24} />
                    </div>
                    <span>AttendFlow</span>
                </div>

                <div className="nav-section">
                    <p className="section-label">Institutional Portal</p>
                    <nav>
                        {currentNav.map(item => (
                            <button
                                key={item.id}
                                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => { 
                                    setActiveTab(item.id); 
                                    if (window.innerWidth <= 1024) setIsSidebarOpen(false); 
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div style={{ padding: '2rem', borderTop: '1px solid var(--border-color)' }}>
                    <p className="section-label">Account Controls</p>
                    <button onClick={logout} className="nav-item">
                        <LogOut size={20} />
                        Logout Session
                    </button>
                    <button onClick={onDeleteAccount} className="nav-item danger">
                        <Trash2 size={20} />
                        Terminate Node
                    </button>
                    
                    <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--primary-gradient)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }}>
                            {user?.username?.substring(0, 1).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>{user?.username || 'User'}</p>
                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)' }}>{role}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
                {/* Header */}
                <header 
                    className="top-header" 
                    style={{ 
                        paddingLeft: !isSidebarOpen ? '80px' : '2rem', 
                        transition: 'padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
                    }}
                >
                    <div style={{ position: 'relative', width: '300px' }} className="hidden md:block">
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={18} />
                        <input 
                            type="text" 
                            className="form-input" 
                            style={{ paddingLeft: '3rem', height: '44px', background: 'var(--bg-secondary)', border: 'none' }}
                            placeholder="Search Node..." 
                            value={searchQuery || ''}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchQuery.trim()) {
                                    const query = searchQuery.toLowerCase();
                                    if (query.includes('leave') || query.includes('request') || query.includes('application')) {
                                        setActiveTab('leave');
                                    } else if (query.includes('attendance') || query.includes('mark') || query.includes('absent') || query.includes('entry')) {
                                        setActiveTab('faculty-attendance');
                                    } else if (query.includes('report') || query.includes('system') || query.includes('analytic')) {
                                        setActiveTab('reports');
                                    } else if (query.includes('curricul')) {
                                        setActiveTab('curriculum');
                                    } else if (query.includes('dashboard') || query.includes('stats') || query.includes('metric') || query.includes('admin') || query.includes('hub')) {
                                        if (role === 'TEACHER') setActiveTab('faculty-dashboard');
                                        else if (role === 'ADMIN') setActiveTab('admin-dashboard');
                                        else if (role === 'HOD') setActiveTab('hod-dashboard');
                                        else setActiveTab('student-dashboard');
                                    } else if (query.includes('profile') || query.includes('identity') || query.includes('account')) {
                                        setActiveTab('profile');
                                    } else if (query.includes('setting') || query.includes('config')) {
                                        setActiveTab('settings');
                                    } else if (query.includes('schedule') || query.includes('routine')) {
                                        setActiveTab('schedule');
                                    } else if (query.includes('home') || query.includes('terminal') || query.includes('overview')) {
                                        if (role === 'ADMIN') setActiveTab('admin-dashboard');
                                        else if (role === 'HOD') setActiveTab('hod-dashboard');
                                        else if (role === 'STUDENT') setActiveTab('student-dashboard');
                                        else setActiveTab('faculty-dashboard');
                                    } else {
                                        setActiveTab(role === 'STUDENT' ? 'student-dashboard' : 'students');
                                    }
                                }
                            }}
                        />
                    </div>

                    <div style={{ flex: 1 }} className="hidden lg:flex"></div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button 
                            onClick={onDeleteAccount}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem', 
                                padding: '0.5rem 1rem', 
                                background: 'rgba(239, 68, 68, 0.1)', 
                                color: '#ef4444', 
                                border: '1px solid rgba(239, 68, 68, 0.2)', 
                                borderRadius: '10px',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                        >
                            <Trash2 size={16} />
                            <span className="hidden md:inline">Delete Account</span>
                        </button>
                        <div style={{ position: 'relative' }}>
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '10px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                            >
                                <Bell size={22} className={showNotifications ? 'text-indigo-600' : 'text-gray-400'} />
                                <div style={{ position: 'absolute', top: '6px', right: '6px', width: '10px', height: '10px', background: 'var(--error-color)', border: '2px solid white', borderRadius: '50%' }}></div>
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        style={{ 
                                            position: 'absolute', top: '120%', right: 0, width: '320px', 
                                            background: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                                            border: '1px solid var(--border-color)', zIndex: 100, padding: '1.25rem'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <h4 style={{ fontWeight: 800, fontSize: '1rem' }}>System Alerts</h4>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 700 }}>Mark all read</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {notifications.map(n => (
                                                <div key={n.id} style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-secondary)', cursor: 'pointer' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                        <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)' }}>{n.title}</span>
                                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 600 }}>{n.time}</span>
                                                    </div>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.4 }}>{n.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => { setActiveTab('reports'); setShowNotifications(false); }}
                                            style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary-color)', border: 'none', borderRadius: '10px', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer' }}
                                        >
                                            View Performance Analytics
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <button 
                            onClick={() => setActiveTab('profile')}
                            style={{ 
                                width: '44px', height: '44px', borderRadius: '12px', background: 'var(--bg-secondary)', 
                                border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', 
                                justifyContent: 'center', cursor: 'pointer', outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <User size={24} className="text-gray-400" />
                        </button>
                    </div>
                </header>

                <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
