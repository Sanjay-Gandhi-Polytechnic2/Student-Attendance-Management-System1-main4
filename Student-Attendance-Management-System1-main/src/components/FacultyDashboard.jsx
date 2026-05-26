import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Users, CheckCircle, Clock, Download, FileText, UserPlus, Lock, Eye, Send, XCircle, Trash2, RefreshCw } from 'lucide-react';
import { api } from '../api';
import { generateStudentReport, generateRegistryExport, generateMasterReport } from '../utils/exportUtils';
import ClassSchedule from './ClassSchedule';

const FacultyDashboard = ({ user, students = [], onNavigateToAttendance, searchQuery = '', settings, setSettings, onDeleteAccount }) => {
    const [showRegistryPopup, setShowRegistryPopup] = useState(false);
    const [isUpdatingKey, setIsUpdatingKey] = useState(false);
    const [oldKey, setOldKey] = useState('');
    const [newKey, setNewKey] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [selectedSection, setSelectedSection] = useState('All');

    // SMS states
    const [smsLogs, setSmsLogs] = useState([]);
    const [isLoadingSmsLogs, setIsLoadingSmsLogs] = useState(false);
    const [testPhone, setTestPhone] = useState('');
    const [testStudentName, setTestStudentName] = useState('');
    const [testMessage, setTestMessage] = useState('');
    const [isSendingTestSms, setIsSendingTestSms] = useState(false);

    const fetchSmsLogs = async () => {
        setIsLoadingSmsLogs(true);
        try {
            const logs = await api.getSmsLogs();
            setSmsLogs(logs);
        } catch (error) {
            console.error('Failed to load SMS logs:', error);
        } finally {
            setIsLoadingSmsLogs(false);
        }
    };

    useEffect(() => {
        fetchSmsLogs();
    }, []);

    const handleSendTestSms = async (e) => {
        e.preventDefault();
        if (!testPhone) return;
        setIsSendingTestSms(true);
        try {
            const res = await api.sendTestSms(testPhone, testStudentName, testMessage);
            setStatus({ 
                type: 'success', 
                message: `SMS processed! Gateway Status: ${res.status || 'SUCCESS'}` 
            });
            setTestPhone('');
            setTestStudentName('');
            setTestMessage('');
            fetchSmsLogs();
            setTimeout(() => setStatus({ type: '', message: '' }), 5000);
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
            setTimeout(() => setStatus({ type: '', message: '' }), 5000);
        } finally {
            setIsSendingTestSms(false);
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

    // Automation handlers
    const handleSimulateSweep = async () => {
        try {
            const res = await api.post('/api/config/simulate-sweep');
            setStatus({ type: 'success', message: `Sweep executed: ${res.data.sweptCount} records.` });
        } catch (e) {
            setStatus({ type: 'error', message: e.message });
        }
    };

    const handleSimulateReset = async () => {
        try {
            const res = await api.post('/api/config/simulate-reset');
            setStatus({ type: 'success', message: `Reset executed: ${res.data.resetCount} records.` });
        } catch (e) {
            setStatus({ type: 'error', message: e.message });
        }
    };

    const handleFinalizeRegistry = () => {
        setShowRegistryPopup(true);
        setTimeout(() => setShowRegistryPopup(false), 3500);
    };

    // Dynamic Stats
    const totalStudents = students.length;
    const filteredBySection = students.filter(s => selectedSection === 'All' || s.section === selectedSection);
    const pendingActions = filteredBySection.filter(s => s.status === 'Pending').length;
    
    // Derived activity log from actual student status updates
    const recentActivity = filteredBySection
        .filter(s => s.status && s.time !== '-')
        .slice(0, 3)
        .map(s => ({
            label: `Attendance marked for ${s.name} (${s.roll})`,
            time: s.time,
            status: s.status === 'Present' ? 'COMPLETED' : 'ABSENT'
        }));

    const teamMembers = [
        "M Shiva Balaji Gouda",
        "Shaik Irshan",
        "Dasari Charan Venkat",
        "Sidda Reddy",
        "Harsha Reddy",
        "Indravaraprasad"
    ].filter(name => (name || '').toLowerCase().includes((searchQuery || '').toLowerCase()));

    const avgAttendance = totalStudents > 0 
        ? Math.round((students.reduce((acc, s) => acc + (s.presentCount || 0), 0) / 
          students.reduce((acc, s) => acc + (s.presentCount || 0) + (s.absentCount || 0) || 1, 0)) * 100) 
        : 0;

    return (
        <div className="animate-fade space-y-6">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome, {user?.username}</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Faculty Dashboard & Management Terminal</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                         onClick={handleFinalizeRegistry}
                        className="btn btn-secondary"
                        style={{ height: '48px', padding: '0 1.5rem', fontWeight: 700, borderColor: 'var(--success-color)', color: 'var(--success-color)' }}
                    >
                        <CheckCircle size={18} />
                        Finalize Registry
                    </button>
                    <button 
                        onClick={() => generateMasterReport(students)}
                        className="btn btn-secondary"
                        style={{ height: '48px', padding: '0 1.5rem', fontWeight: 700, borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                    >
                        <FileText size={18} />
                        Export Master
                    </button>
                    <button 
                        onClick={() => onNavigateToAttendance('reports')}
                        className="btn btn-primary"
                        style={{ height: '48px', padding: '0 1.5rem', fontWeight: 700 }}
                    >
                        <Activity size={18} />
                        View Reports
                    </button>
                </div>
            </header>

            {status.message && (
                <div style={{ 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: status.type === 'success' ? 'var(--success-color)' : 'var(--error-color)',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: status.type === 'success' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    {status.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {status.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <DashboardCard icon={<Activity />} title="Live Classes" value="04" color="#6366f1" />
                <DashboardCard icon={<Users />} title="Total Students" value={totalStudents || "..."} color="#10b981" />
                <DashboardCard icon={<CheckCircle />} title="Avg Attendance" value={`${avgAttendance}%`} color="#10b981" />
                <DashboardCard icon={<Clock />} title="Pending Records" value={pendingActions} color="#f59e0b" />
            </div>

            <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Section Filter:</span>
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
                            {s === 'All' ? 'View All' : `Section ${s}`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Recent Class Activity</h3>
                    <div className="space-y-4">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((act, i) => (
                                <ActivityItem key={act.label + i} label={act.label} time={act.time} status={act.status} />
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)', fontWeight: 600 }}>No recent activity vectors detected.</p>
                        )}
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Session Protocols</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <ActionButton icon={<Users />} label="Student Registry" onClick={() => onNavigateToAttendance('students')} />
                        <ActionButton icon={<CheckCircle />} label="Faculty Attendance Entry" onClick={() => onNavigateToAttendance('faculty-attendance')} />
                        <ActionButton icon={<UserPlus size={20} />} label="Member Directory" onClick={() => onNavigateToAttendance('students')} />
                        <ActionButton icon={<Download />} label="Download Registry" onClick={() => generateRegistryExport(students)} />
                        <ActionButton icon={<FileText />} label="Generate Report" onClick={() => generateStudentReport(students)} />
                        <ActionButton icon={<Clock />} label="Leave Gateway" onClick={() => onNavigateToAttendance('leave')} />
                        <ActionButton 
                            icon={<Eye size={20} />} 
                            label="Dark Interface" 
                            onClick={toggleDarkMode} 
                            highlight={settings?.darkMode} 
                        />
                         <ActionButton 
                            icon={<Lock size={20} />} 
                            label="Update Access Key" 
                            onClick={() => setIsUpdatingKey(true)} 
                        />
                        <ActionButton 
                            icon={<Trash2 size={20} />} 
                            label="Delete Account" 
                            onClick={onDeleteAccount} 
                            isDanger
                        />
                        <ActionButton 
                            icon={<RefreshCw size={20} />} 
                            label="Simulate Sweep" 
                            onClick={handleSimulateSweep} 
                        />
                        <ActionButton 
                            icon={<RefreshCw size={20} />} 
                            label="Simulate Reset" 
                            onClick={handleSimulateReset} 
                        />
                        <ActionButton icon={<FileText />} label="Syllabus DCS C-25 (PDF)" onClick={() => window.open('https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_1_4_ComputerScience&Engineering.pdf', '_blank')} />
                        <ActionButton icon={<FileText />} label="Syllabus C-20 (Web)" onClick={() => window.open('https://dtek.karnataka.gov.in/52/c-20-syllabus/en', '_blank')} />
                        <ActionButton icon={<FileText />} label="Syllabus DEEE C-25 (PDF)" onClick={() => window.open('https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_EE_1_4_Electrical&ElectronicsEngineering.pdf', '_blank')} />
                        <ActionButton icon={<FileText />} label="Syllabus DME C-25 (PDF)" onClick={() => window.open('https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_ME_1_4_MechanicalEngineering.pdf', '_blank')} />
                        <ActionButton icon={<FileText />} label="Syllabus DMT C-25 (PDF)" onClick={() => window.open('https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_MT_1_4_MetallurgicalEngineering.pdf', '_blank')} />
                        <ActionButton icon={<FileText />} label="Syllabus DCE C-25 (PDF)" onClick={() => window.open('https://dtek.karnataka.gov.in/storage/pdf-files/ACM/C_25_Draft_CE_1_4_CivilEngineering.pdf', '_blank')} />
                    </div>
                </div>
            </div>
            <ClassSchedule />

            <div className="card space-y-6">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '12px', color: 'var(--primary-color)' }}>
                            <Send size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 700, margin: 0 }}>Parent SMS Telemetry Logging</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Outbound SMS transmissions, delivery status auditing, and sandboxed manual triggers</p>
                        </div>
                    </div>
                    <button 
                        onClick={fetchSmsLogs} 
                        disabled={isLoadingSmsLogs}
                        className="btn btn-secondary" 
                        style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}
                    >
                        <RefreshCw size={14} className={isLoadingSmsLogs ? 'animate-spin' : ''} />
                        Reload Console
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* SMS Logs Table (Terminal Style) */}
                    <div className="xl:col-span-2 space-y-4">
                        <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-color)', textTransform: 'uppercase', tracking: 'wide' }}>Outbound Alert Logs</h4>
                        <div style={{ 
                            background: 'var(--bg-secondary)', 
                            borderRadius: '12px', 
                            border: '1px solid var(--border-color)',
                            overflow: 'hidden',
                            maxHeight: '350px',
                            overflowY: 'auto'
                        }}>
                            {smsLogs.length === 0 ? (
                                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                                    <Send size={32} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                    No outbound SMS transmissions logged in this session
                                </div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 700 }}>
                                            <th style={{ padding: '0.75rem 1rem' }}>Student</th>
                                            <th style={{ padding: '0.75rem 1rem' }}>Recipient No.</th>
                                            <th style={{ padding: '0.75rem 1rem' }}>Message Payload</th>
                                            <th style={{ padding: '0.75rem 1rem' }}>Sent Time</th>
                                            <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {smsLogs.map((log) => (
                                            <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{log.studentName}</td>
                                                <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace' }}>{log.recipientNumber}</td>
                                                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.messageContent}>
                                                    {log.messageContent}
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-light)' }}>{log.sentTime}</td>
                                                <td style={{ padding: '0.75rem 1rem' }}>
                                                    <span style={{ 
                                                        display: 'inline-block',
                                                        padding: '0.2rem 0.5rem',
                                                        borderRadius: '6px',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 800,
                                                        background: log.status?.includes('DELIVERED') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(79, 70, 229, 0.1)',
                                                        color: log.status?.includes('DELIVERED') ? 'var(--success-color)' : 'var(--primary-color)',
                                                        border: log.status?.includes('DELIVERED') ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(79, 70, 229, 0.2)'
                                                    }}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* SMS Sandboxed Manual Trigger */}
                    <div className="space-y-4">
                        <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--success-color)', textTransform: 'uppercase', tracking: 'wide' }}>Interactive Sandbox Gateway</h4>
                        <form onSubmit={handleSendTestSms} style={{ 
                            background: 'var(--bg-primary)', 
                            padding: '1.5rem', 
                            borderRadius: '12px', 
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', lineHeight: 1.4 }}>
                                Verify gateway cellular transmission. Valid international numbers (e.g. <code>+919876543210</code>) are required for Textbelt dispatches.
                            </p>
                            
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Parent Mobile Number</label>
                                <input 
                                    type="tel" 
                                    placeholder="+919876543210" 
                                    required 
                                    value={testPhone}
                                    onChange={(e) => setTestPhone(e.target.value)}
                                    style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.8rem', background: 'var(--bg-secondary)', fontWeight: 600 }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Student Name (Optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="E.g., Alice Johnson" 
                                    value={testStudentName}
                                    onChange={(e) => setTestStudentName(e.target.value)}
                                    style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.8rem', background: 'var(--bg-secondary)', fontWeight: 600 }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Message Payload (Optional)</label>
                                <textarea 
                                    placeholder="Enter custom SMS body..." 
                                    rows="2"
                                    value={testMessage}
                                    onChange={(e) => setTestMessage(e.target.value)}
                                    style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.8rem', background: 'var(--bg-secondary)', fontWeight: 600, fontFamily: 'inherit', resize: 'none' }}
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSendingTestSms}
                                className="btn btn-primary" 
                                style={{ width: '100%', height: '42px', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8rem' }}
                            >
                                <Send size={14} />
                                {isSendingTestSms ? 'Transmitting payload...' : 'Transmit Sandbox Alert'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

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

const DashboardCard = ({ icon, title, value, color }) => (
    <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: color + '15', color, borderRadius: '12px' }}>{icon}</div>
            <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-light)' }}>{title}</p>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{value}</h4>
            </div>
        </div>
    </div>
);

const ActivityItem = ({ label, time, status }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
            <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{label}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{time}</p>
        </div>
        <span className={`badge ${status === 'COMPLETED' ? 'badge-success' : 'badge-danger'}`}>{status}</span>
    </div>
);

const ActionButton = ({ icon, label, onClick, highlight, isDanger }) => (
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

export default FacultyDashboard;
