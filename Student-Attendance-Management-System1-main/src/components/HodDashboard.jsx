import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Users, ClipboardList, TrendingUp, UserCheck, AlertTriangle, Download, FileText, CheckCircle, Lock, Eye, Send, XCircle, Trash2 } from 'lucide-react';
import { api } from '../api';
import { generateStudentReport, generateRegistryExport } from '../utils/exportUtils';
import ClassSchedule from './ClassSchedule';

const HodDashboard = ({ user, students = [], onNavigate, searchQuery = '', settings, setSettings, onDeleteAccount }) => {
    const [showRegistryPopup, setShowRegistryPopup] = useState(false);
    const [isUpdatingKey, setIsUpdatingKey] = useState(false);
    const [oldKey, setOldKey] = useState('');
    const [newKey, setNewKey] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [selectedSection, setSelectedSection] = useState('All');
    const [leaveRequests, setLeaveRequests] = useState([]);

    React.useEffect(() => {
        loadLeaveRequests();
    }, []);

    const loadLeaveRequests = async () => {
        try {
            const data = await api.getLeaveRequests();
            setLeaveRequests(data);
        } catch (error) {
            console.error("Failed to load leave requests:", error);
        }
    };

    const handleUpdateKey = async (e) => {
        e.preventDefault();
        if (!oldKey || !newKey) return;
        
        try {
            await api.updatePassword(user.id, oldKey, newKey);
            setStatus({ type: 'success', message: 'Access Key updated successfully' });
            setOldKey('');
            setNewKey('');
            setTimeout(() => {
                setIsUpdatingKey(false);
                setStatus({ type: '', message: '' });
            }, 2000);
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        }
    };

    const toggleDarkMode = () => {
        setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
    };

    const handleFinalizeRegistry = () => {
        setShowRegistryPopup(true);
        setTimeout(() => setShowRegistryPopup(false), 3500);
    };

    // Dynamic Analysis
    const totalStudents = students.length;
    const filteredBySection = students.filter(s => selectedSection === 'All' || s.section === selectedSection);
    
    const presentRate = totalStudents > 0 
        ? Math.round((filteredBySection.filter(s => s.status === 'Present').length / (filteredBySection.length || 1)) * 100) 
        : 0;

    const pendingLeaveRequests = leaveRequests.filter(r => r.status === 'Pending');
    const actionsRequiredCount = filteredBySection.filter(s => s.status === 'Absent').length + pendingLeaveRequests.length;

    const filteredStudents = filteredBySection.filter(s => 
        (s.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) || 
        (s.roll || '').toLowerCase().includes((searchQuery || '').toLowerCase())
    );

    const teamMembers = [
        "M Shiva Balaji Gouda",
        "Shaik Irshan",
        "Dasari Charan Venkat",
        "Sidda Reddy",
        "Harsha Reddy",
        "Indravaraprasad"
    ].filter(name => (name || '').toLowerCase().includes((searchQuery || '').toLowerCase()));

    return (
        <div className="animate-fade space-y-6">
            <header>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Dept. Intelligence Hub</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome, {user?.username} | Institutional Oversight</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <HODMetricCard icon={<Users />} title="Identified Learners" value={filteredBySection.length} color="#6366f1" />
                <HODMetricCard icon={<TrendingUp />} title="Presence Rate" value={`${presentRate}%`} color="#10b981" />
                <HODMetricCard icon={<AlertTriangle />} title="Action Required" value={actionsRequiredCount} color="#ef4444" />
            </div>

            <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Dept Section Filter:</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['All', 'A', 'B', 'C', 'D'].map(s => (
                        <button 
                            key={s}
                            onClick={() => setSelectedSection(s)}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '10px',
                                border: '1px solid var(--border-color)',
                                background: selectedSection === s ? 'var(--primary-gradient)' : 'white',
                                color: selectedSection === s ? 'white' : 'var(--text-primary)',
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: selectedSection === s ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none'
                            }}
                        >
                            {s === 'All' ? 'Complete Dept' : `Section ${s}`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Node Activity Stream</h3>
                    <div className="space-y-4">
                        {pendingLeaveRequests.length > 0 ? (
                            pendingLeaveRequests.map((req, idx) => (
                                <DeptActivityItem 
                                    key={req.id || idx}
                                    msg={`Pending Authorization: ${req.type} for ${req.facultyName}`} 
                                    time={`${req.startDate} (${req.duration} days)`} 
                                    type="WARNING" 
                                />
                            ))
                        ) : (
                            <>
                                <DeptActivityItem msg="DCS Seminar attendance sync completed" time="15m ago" type="INFO" />
                                <DeptActivityItem msg="High absence alert in Node: SEM-04-B" time="2h ago" type="WARNING" />
                                <DeptActivityItem msg="Faculty authorization updated for DME-01" time="4h ago" type="SUCCESS" />
                            </>
                        )}
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Quick Protocols</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <ProtocolButton icon={<CheckCircle />} label="Faculty Attendance Entry" onClick={() => onNavigate('faculty-attendance')} />
                        <ProtocolButton icon={<FileText />} label="Generate Report" onClick={() => generateStudentReport(students)} />
                        <ProtocolButton icon={<Download />} label="Download Registry" onClick={() => generateRegistryExport(students)} />
                        <ProtocolButton icon={<Users />} label="Member Directory" onClick={() => onNavigate('students')} />
                        <ProtocolButton icon={<Activity />} label="Analytics" onClick={() => onNavigate('reports')} />
                        <ProtocolButton icon={<Users />} label="Leave Gateway" onClick={() => onNavigate('leave')} />
                        <ProtocolButton 
                            icon={<Eye />} 
                            label="Dark Interface" 
                            onClick={toggleDarkMode} 
                            highlight={settings?.darkMode} 
                        />
                        <ProtocolButton 
                            icon={<Lock />} 
                            label="Update Access Key" 
                            onClick={() => setIsUpdatingKey(true)} 
                        />
                        <ProtocolButton 
                            icon={<Trash2 />} 
                            label="Delete Account" 
                            onClick={onDeleteAccount} 
                            isDanger
                        />
                        <ProtocolButton icon={<FileText />} label="Syllabus DCS C-25 (PDF)" onClick={() => window.open('https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_1_4_ComputerScience&Engineering.pdf', '_blank')} />
                        <ProtocolButton icon={<FileText />} label="Syllabus C-20 (Web)" onClick={() => window.open('https://dtek.karnataka.gov.in/52/c-20-syllabus/en', '_blank')} />
                        <ProtocolButton icon={<FileText />} label="Syllabus DEEE C-25 (PDF)" onClick={() => window.open('https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_EE_1_4_Electrical&ElectronicsEngineering.pdf', '_blank')} />
                        <ProtocolButton icon={<FileText />} label="Syllabus DME C-25 (PDF)" onClick={() => window.open('https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_ME_1_4_MechanicalEngineering.pdf', '_blank')} />
                        <ProtocolButton icon={<FileText />} label="Syllabus DMT C-25 (PDF)" onClick={() => window.open('https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_MT_1_4_MetallurgicalEngineering.pdf', '_blank')} />
                        <ProtocolButton icon={<FileText />} label="Syllabus DCE C-25 (PDF)" onClick={() => window.open('https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_CE_1_4_CivilEngineering.pdf', '_blank')} />
                    </div>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontWeight: 700 }}>Attendance Monitor</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                            onClick={handleFinalizeRegistry}
                            className="btn btn-secondary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderColor: 'var(--success-color)', color: 'var(--success-color)', fontWeight: 700 }}
                        >
                            Finalize Registry
                        </button>
                        <button 
                            onClick={() => onNavigate('faculty-attendance')}
                            className="btn btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                        >
                            Mark Attendance
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-light)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Learner Identity</th>
                                <th style={{ padding: '1rem', color: 'var(--text-light)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Branch/Sem</th>
                                <th style={{ padding: '1rem', color: 'var(--text-light)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Subject</th>
                                 <th style={{ padding: '1rem', color: 'var(--text-light)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Protocol Status</th>
                                <th style={{ padding: '1rem', color: 'var(--text-light)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Academic Performance</th>
                                <th style={{ padding: '1rem', color: 'var(--text-light)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Sync Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, i) => {
                                    const total = (student.presentCount || 0) + (student.absentCount || 0);
                                    const percentage = total > 0 ? ((student.presentCount / total) * 100).toFixed(1) : '0.0';
                                    
                                    return (
                                        <tr key={student.id || i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 700 }}>{student.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>{student.roll}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{student.branch || 'DCS'}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>SEM-0{student.semester || '1'}</div>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>{student.subject || '-'}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span className={`badge badge-${student.status === 'Present' ? 'success' : student.status === 'Absent' ? 'danger' : 'warning'}`}>
                                                    {student.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: 800, color: 'var(--primary-color)', fontSize: '0.85rem' }}>{percentage}%</span>
                                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', fontWeight: 600 }}>P:{student.presentCount || 0} A:{student.absentCount || 0}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>{student.time || '-'}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>No matching metrics found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ClassSchedule />

            <div className="card">
                <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>The Team Members</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {teamMembers.length > 0 ? teamMembers.map((name, idx) => (
                        <div key={idx} style={{ 
                            padding: '1rem', 
                            background: 'var(--bg-secondary)', 
                            borderRadius: '12px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1rem',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div style={{ 
                                width: '32px', 
                                height: '32px', 
                                background: 'var(--primary-gradient)', 
                                color: 'white', 
                                borderRadius: '8px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontWeight: 800,
                                fontSize: '0.8rem'
                            }}>
                                {name.charAt(0)}
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{name}</h4>
                                <p style={{ fontSize: '0.65rem', color: 'var(--success-color)', fontWeight: 700, margin: 0 }}>SGP STUDENT</p>
                            </div>
                        </div>
                    )) : (
                        <p style={{ padding: '1rem', color: 'var(--text-light)', fontStyle: 'italic' }}>No matching team members found.</p>
                    )}
                </div>
            </div>

            {/* Finalize Log Registry Success Popup */}
            <AnimatePresence>
                {showRegistryPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 200, padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                            style={{
                                background: 'var(--bg-primary)',
                                borderRadius: '24px',
                                padding: '3rem 2.5rem',
                                maxWidth: '420px',
                                width: '100%',
                                textAlign: 'center',
                                boxShadow: '0 25px 60px rgba(16,185,129,0.25), 0 0 0 1px rgba(16,185,129,0.15)',
                                border: '1px solid rgba(16,185,129,0.3)'
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 20 }}
                                style={{
                                    width: '80px', height: '80px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    boxShadow: '0 8px 32px rgba(16,185,129,0.4)'
                                }}
                            >
                                <CheckCircle size={40} color="white" />
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: '#10b981' }}
                            >
                                Registry Finalized!
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.6 }}
                            >
                                Student Registry Successfully Updated
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.45 }}
                                style={{ marginTop: '2rem' }}
                            >
                                <button
                                    onClick={() => setShowRegistryPopup(false)}
                                    className="btn btn-primary"
                                    style={{ padding: '0.75rem 2rem', fontWeight: 700, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
                                >
                                    <CheckCircle size={16} /> Close
                                </button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Access Key Update Modal */}
            <AnimatePresence>
                {isUpdatingKey && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card" 
                            style={{ maxWidth: '400px', width: '100%', padding: '2.5rem' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontWeight: 800, fontSize: '1.25rem' }}>Access Key Protocol</h3>
                                <button onClick={() => setIsUpdatingKey(false)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
                                    <XCircle size={24} />
                                </button>
                            </div>
                            
                            <form className="space-y-4" onSubmit={handleUpdateKey}>
                                <div className="form-group">
                                    <label className="form-label">Old Access Key</label>
                                    <input 
                                        type="password" 
                                        className="form-input" 
                                        placeholder="Enter current PIN..." 
                                        value={oldKey}
                                        onChange={(e) => setOldKey(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">New Access Key</label>
                                    <input 
                                        type="password" 
                                        className="form-input" 
                                        placeholder="Enter new 6-digit PIN..." 
                                        value={newKey}
                                        onChange={(e) => setNewKey(e.target.value)}
                                        required 
                                    />
                                </div>
                                
                                {status.message && (
                                    <div style={{ 
                                        padding: '0.75rem', 
                                        borderRadius: '8px', 
                                        background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: status.type === 'success' ? 'var(--success-color)' : 'var(--error-color)',
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        {status.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                        {status.message}
                                    </div>
                                )}

                                <button type="submit" className="btn btn-primary w-full" style={{ height: '52px', marginTop: '1rem' }}>
                                    <Send size={18} />
                                    Synchronize Key
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const HODMetricCard = ({ icon, title, value, color }) => (
    <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ padding: '0.75rem', background: color + '15', color, borderRadius: '12px' }}>{icon}</div>
            <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>{title}</p>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{value}</h4>
            </div>
        </div>
    </div>
);

const DeptActivityItem = ({ msg, time, type }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
        <div style={{ 
            width: '8px', height: '8px', borderRadius: '50%', 
            background: type === 'WARNING' ? 'var(--error-color)' : type === 'SUCCESS' ? 'var(--success-color)' : 'var(--primary-color)' 
        }}></div>
        <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{msg}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{time}</p>
        </div>
    </div>
);

const ProtocolButton = ({ icon, label, onClick, highlight, isDanger }) => (
    <button 
        onClick={onClick}
        className="btn btn-secondary" 
        style={{
            height: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center',
            ...(highlight ? {
                background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.08))',
                borderColor: 'rgba(16,185,129,0.5)',
                boxShadow: '0 0 16px rgba(16,185,129,0.15)'
            } : {}),
            ...(isDanger ? {
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: '#ef4444'
            } : {})
        }}
    >
        <span style={{ color: highlight ? '#10b981' : isDanger ? '#ef4444' : 'var(--primary-color)' }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: highlight ? '#10b981' : 'inherit' }}>{label}</span>
    </button>
);

export default HodDashboard;
