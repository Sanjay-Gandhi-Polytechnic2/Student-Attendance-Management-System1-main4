import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Key, Smartphone, MapPin, Trash2, ShieldAlert } from 'lucide-react';

const ProfilePage = ({ user, onDeleteAccount }) => {
    return (
        <div className="animate-fade space-y-8">
            <header>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Institutional Identity</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Manage your centralized profile and node security</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Identity Card */}
                <div className="card lg:col-span-1" style={{ textAlign: 'center' }}>
                    <div style={{ 
                        width: '120px', height: '120px', background: 'var(--primary-gradient)', 
                        borderRadius: '30px', margin: '0 auto 1.5rem', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', color: 'white' 
                    }}>
                        <User size={60} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user?.username}</h3>
                    <p style={{ color: 'var(--primary-color)', fontWeight: 700, letterSpacing: '0.05em', marginTop: '0.25rem' }}>{user?.role}</p>
                    
                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-light)' }}>Member Class</span>
                            <span style={{ fontWeight: 700 }}>
                                {user?.role === 'HOD' ? 'HOD-Node' : (user?.role === 'STUDENT' ? 'Student-Node' : (user?.role === 'ADMIN' ? 'Admin-Node' : 'Faculty-Node'))}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-light)' }}>Join Date</span>
                            <span style={{ fontWeight: 700 }}>Aug 2024</span>
                        </div>
                    </div>
                </div>

                {/* Information Grid */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Identity Attributes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ProfileField icon={<User />} label="Display Alias" value={user?.username} />
                            <ProfileField icon={<Mail />} label="Secure Email" value={user?.email || 'N/A'} />
                            <ProfileField icon={<Smartphone />} label="Mobile Hub" value="+91 XXXXX XXXXX" />
                            <ProfileField icon={<MapPin />} label="Assigned Dept" value="Applied Sciences" />
                        </div>
                    </div>

                    <div className="card" style={{ border: '1px solid #fee2e2' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '0.5rem', background: '#fee2e2', borderRadius: '8px', color: 'var(--error-color)' }}>
                                <ShieldAlert size={20} />
                            </div>
                            <h3 style={{ fontWeight: 700, color: '#991b1b' }}>Security Zone</h3>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                            Terminating your institutional node will permanently delete all associated telemetry and records. 
                            This action is final and cannot be rolled back.
                        </p>
                        <button 
                            onClick={onDeleteAccount}
                            className="btn btn-secondary" 
                            style={{ color: 'var(--error-color)', borderColor: '#fca5a5', width: '100%' }}
                        >
                            <Trash2 size={18} />
                            Initiate Node Deletion
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileField = ({ icon, label, value }) => (
    <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ color: 'var(--primary-color)', marginTop: '0.25rem' }}>{icon}</div>
        <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>{label}</p>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{value}</p>
        </div>
    </div>
);

export default ProfilePage;
