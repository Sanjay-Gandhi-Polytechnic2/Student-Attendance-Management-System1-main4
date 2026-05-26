import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Bell, Eye, Trash2, Globe, Cpu, Lock, XCircle, Send, CheckCircle, Activity, Clock, Zap, RefreshCw } from 'lucide-react';
import { api } from '../api';

const PortalSettings = ({ user, settings, setSettings, autoConfig, setAutoConfig, onDeleteAccount, onSyncRegistry }) => {
    const [isUpdatingKey, setIsUpdatingKey] = useState(false);
    const [currentKey, setCurrentKey] = useState('');
    const [newKey, setNewKey] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    
    // Simulation states
    const [isSimulatingSweep, setIsSimulatingSweep] = useState(false);
    const [isSimulatingReset, setIsSimulatingReset] = useState(false);
    const [simulationResult, setSimulationResult] = useState('');

    // SMS states
    const [smsLogs, setSmsLogs] = useState([]);
    const [isLoadingSmsLogs, setIsLoadingSmsLogs] = useState(false);
    const [testPhone, setTestPhone] = useState('');
    const [testStudentName, setTestStudentName] = useState('');
    const [testMessage, setTestMessage] = useState('');
    const [isSendingTestSms, setIsSendingTestSms] = useState(false);

    const isAuthority = user?.role === 'HOD' || user?.role === 'ADMIN';

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
        if (isAuthority) {
            fetchSmsLogs();
        }
    }, [isAuthority]);

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
        if (!newKey || !currentKey) return;
        
        try {
            await api.updatePassword(user.id, currentKey, newKey);
            setStatus({ type: 'success', message: 'Access Key updated successfully' });
            setNewKey('');
            setCurrentKey('');
            setTimeout(() => {
                setIsUpdatingKey(false);
                setStatus({ type: '', message: '' });
            }, 2000);
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        }
    };

    const toggleNotification = () => {
        setSettings(prev => ({ ...prev, notifications: !prev.notifications }));
    };

    const toggleDarkMode = () => {
        setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
    };

    // Automated config save handlers
    const updateAutoConfigField = async (field, value) => {
        if (!autoConfig) return;
        const updated = { ...autoConfig, [field]: value };
        try {
            const data = await api.updateSystemConfig(updated);
            setAutoConfig(data);
            setStatus({ type: 'success', message: 'Automation rule updated' });
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        }
    };

    const triggerSweepSimulation = async () => {
        setIsSimulatingSweep(true);
        setSimulationResult('');
        try {
            const result = await api.simulateSweep();
            setIsSimulatingSweep(false);
            setSimulationResult(`Simulation Success: Swept ${result.sweptCount} student records to 'Absent'. Emails dispatched successfully.`);
            if (onSyncRegistry) onSyncRegistry();
        } catch (error) {
            setIsSimulatingSweep(false);
            setSimulationResult(`Simulation Failed: ${error.message}`);
        }
    };

    const triggerResetSimulation = async () => {
        setIsSimulatingReset(true);
        setSimulationResult('');
        try {
            const result = await api.simulateReset();
            setIsSimulatingReset(false);
            setSimulationResult(`Simulation Success: Daily statuses for ${result.resetCount} students restored to 'Unknown'.`);
            if (onSyncRegistry) onSyncRegistry();
        } catch (error) {
            setIsSimulatingReset(false);
            setSimulationResult(`Simulation Failed: ${error.message}`);
        }
    };

    return (
        <div className="animate-fade space-y-8">
            <header>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Portal Configuration</h2>
                <p style={{ color: 'var(--text-secondary)' }}>System preferences and operational parameters</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Protocols */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '12px', color: 'var(--primary-color)' }}>
                            <Cpu size={24} />
                        </div>
                        <h3 style={{ fontWeight: 700 }}>Interface Protocols</h3>
                    </div>

                    <div className="space-y-6">
                        <ToggleItem 
                            icon={<Bell />} label="Telemetry Alerts" 
                            desc="Receive real-time notifications about node status"
                            active={settings.notifications} onToggle={toggleNotification}
                        />
                        <ToggleItem 
                            icon={<Eye />} label="Dark Interface" 
                            desc="Optimize visual output for low-light environments"
                            active={settings.darkMode} onToggle={toggleDarkMode}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Globe size={20} className="text-gray-400" />
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Global Language</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Portal regional configuration</p>
                                </div>
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>ENGLISH (US)</span>
                        </div>
                    </div>
                </div>

                {/* Security Matrix */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '12px', color: 'var(--primary-color)' }}>
                            <Lock size={24} />
                        </div>
                        <h3 style={{ fontWeight: 700 }}>Security Matrix</h3>
                    </div>

                    <div className="space-y-4">
                        <button 
                            onClick={() => setIsUpdatingKey(true)}
                            className="btn btn-secondary w-full" style={{ justifyContent: 'space-between', padding: '1.25rem' }}
                        >
                            <div className="flex gap-3">
                                <Lock size={18} />
                                <span style={{ fontWeight: 600 }}>Update Access Key</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)' }}>PIN REQUIRED</span>
                        </button>

                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fef2f2', borderRadius: '16px', border: '1px solid #fee2e2' }}>
                            <h4 style={{ color: '#991b1b', fontWeight: 700, marginBottom: '0.5rem' }}>Critical Zone</h4>
                            <p style={{ fontSize: '0.8125rem', color: '#991b1b', opacity: 0.8, marginBottom: '1rem' }}>
                                Account termination is an irreversible operational command.
                            </p>
                            <button 
                                onClick={onDeleteAccount}
                                style={{ width: '100%', padding: '0.75rem', background: 'white', border: '1px solid #fca5a5', borderRadius: '10px', color: '#dc2626', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Trash2 size={16} style={{ marginRight: '0.5rem' }} />
                                Terminate Account Node
                            </button>
                        </div>
                    </div>
                </div>

                {/* Attendance Automation Protocols */}
                {isAuthority && autoConfig && (
                    <div className="card lg:col-span-2">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '12px', color: 'var(--primary-color)' }}>
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontWeight: 700, margin: 0 }}>Attendance Automation Protocols</h3>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Configure background engines and simulation telemetry overrides</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Live Rules Toggles */}
                            <div className="space-y-6">
                                <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-color)', textTransform: 'uppercase', tracking: 'wide' }}>Automation Parameters</h4>
                                
                                <ToggleItem 
                                    icon={<Activity />} 
                                    label="Automated Absent Sweep" 
                                    desc="Sweeps and marks inactive/pending students absent daily at cutoff time"
                                    active={autoConfig.autoAbsentActive} 
                                    onToggle={() => updateAutoConfigField('autoAbsentActive', !autoConfig.autoAbsentActive)}
                                />

                                {autoConfig.autoAbsentActive && (
                                    <div style={{ paddingLeft: '2.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Sweep Cutoff Time</span>
                                            <input 
                                                type="time" 
                                                value={autoConfig.autoAbsentTime} 
                                                onChange={(e) => updateAutoConfigField('autoAbsentTime', e.target.value)}
                                                style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.25rem 0.5rem', fontWeight: 700, fontSize: '0.85rem' }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <ToggleItem 
                                    icon={<Bell />} 
                                    label="Parent Email Notifications" 
                                    desc="Dispatches email telemetry alerts directly to parents when marked absent"
                                    active={autoConfig.autoNotifyActive} 
                                    onToggle={() => updateAutoConfigField('autoNotifyActive', !autoConfig.autoNotifyActive)}
                                />

                                <ToggleItem 
                                    icon={<Send />} 
                                    label="Parent SMS Notifications" 
                                    desc="Dispatches real-time SMS alerts (real/simulated) directly to parent mobile numbers on absence"
                                    active={autoConfig.smsNotifyActive} 
                                    onToggle={() => updateAutoConfigField('smsNotifyActive', !autoConfig.smsNotifyActive)}
                                />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <Clock size={20} className="text-indigo-500" />
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Midnight Session Reset</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Automatic cycle daily restoration</p>
                                        </div>
                                    </div>
                                    <input 
                                        type="time" 
                                        value={autoConfig.autoResetTime} 
                                        onChange={(e) => updateAutoConfigField('autoResetTime', e.target.value)}
                                        style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.25rem 0.5rem', fontWeight: 700, fontSize: '0.85rem' }}
                                    />
                                </div>
                            </div>

                            {/* Telemetry Simulator Override */}
                            <div className="space-y-6" style={{ borderLeft: '1px dashed var(--border-color)', paddingLeft: '2rem' }}>
                                <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--success-color)', textTransform: 'uppercase', tracking: 'wide' }}>Telemetry Overrides</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
                                    Forces instant manual simulation of background services for live demonstration or instant verification cycles.
                                </p>

                                <div className="space-y-4">
                                    <button 
                                        onClick={triggerSweepSimulation}
                                        disabled={isSimulatingSweep}
                                        className="btn btn-secondary w-full"
                                        style={{ justifyContent: 'space-between', padding: '1rem', borderStyle: 'solid', borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <RefreshCw size={18} className={isSimulatingSweep ? 'animate-spin' : ''} />
                                            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{isSimulatingSweep ? 'Finalizing daily sweep...' : 'Simulate End-of-Day Sweep'}</span>
                                        </div>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '6px' }}>FORCE SWEEP</span>
                                    </button>

                                    <button 
                                        onClick={triggerResetSimulation}
                                        disabled={isSimulatingReset}
                                        className="btn btn-secondary w-full"
                                        style={{ justifyContent: 'space-between', padding: '1rem', borderStyle: 'solid', borderColor: 'var(--warning-color)', color: 'var(--warning-color)' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <RefreshCw size={18} className={isSimulatingReset ? 'animate-spin' : ''} />
                                            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{isSimulatingReset ? 'Restoring values...' : 'Simulate Midnight Cycle Reset'}</span>
                                        </div>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '6px' }}>FORCE RESET</span>
                                    </button>
                                </div>

                                {simulationResult && (
                                    <div style={{ 
                                        marginTop: '1rem', 
                                        padding: '1rem', 
                                        background: 'var(--bg-secondary)', 
                                        borderRadius: '12px', 
                                        border: '1px solid var(--border-color)',
                                        fontSize: '0.75rem',
                                        fontFamily: 'monospace',
                                        color: simulationResult.includes('Failed') ? 'var(--error-color)' : 'var(--success-color)',
                                        fontWeight: 600,
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-all'
                                    }}>
                                        {simulationResult}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {isAuthority && (
                    <div className="card lg:col-span-2 space-y-6">
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
                                    background: 'var(--bg-secondary)', 
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
                                            style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.8rem', background: 'var(--bg-primary)', fontWeight: 600 }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Student Name (Optional)</label>
                                        <input 
                                            type="text" 
                                            placeholder="E.g., Alice Johnson" 
                                            value={testStudentName}
                                            onChange={(e) => setTestStudentName(e.target.value)}
                                            style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.8rem', background: 'var(--bg-primary)', fontWeight: 600 }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Message Payload (Optional)</label>
                                        <textarea 
                                            placeholder="Enter custom SMS body..." 
                                            rows="2"
                                            value={testMessage}
                                            onChange={(e) => setTestMessage(e.target.value)}
                                            style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.8rem', background: 'var(--bg-primary)', fontWeight: 600, fontFamily: 'inherit', resize: 'none' }}
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
                )}
            </div>

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
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label className="form-label">Current Access Key</label>
                                    <input 
                                        type="password" 
                                        className="form-input" 
                                        placeholder="Enter current PIN..." 
                                        value={currentKey}
                                        onChange={(e) => setCurrentKey(e.target.value)}
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

const ToggleItem = ({ icon, label, desc, active, onToggle }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ color: 'var(--text-light)' }}>{icon}</div>
            <div>
                <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{label}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', maxWidth: '300px', lineHeight: 1.4 }}>{desc}</p>
            </div>
        </div>
        <button 
            onClick={onToggle}
            style={{ 
                width: '44px', height: '24px', borderRadius: '12px', 
                background: active ? 'var(--primary-gradient)' : '#e5e7eb',
                position: 'relative', border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                flexShrink: 0
            }}
        >
            <div style={{ 
                width: '18px', height: '18px', background: 'white', borderRadius: '50%',
                position: 'absolute', top: '3px', left: active ? '23px' : '3px', transition: 'all 0.3s'
            }}></div>
        </button>
    </div>
);

export default PortalSettings;
