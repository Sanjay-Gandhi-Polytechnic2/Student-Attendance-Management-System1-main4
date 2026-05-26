import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Grid3X3,
    Clock
} from 'lucide-react';
import Layout from './components/Layout';
import AttendancePanel from './components/AttendancePanel';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import RegisterSuccess from './components/RegisterSuccess';
import AdminDashboard from './components/AdminDashboard';
import HodDashboard from './components/HodDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import StudentDashboard from './components/StudentDashboard';
import ReportPage from './components/ReportPage';
import PortalSettings from './components/PortalSettings';
import MemberDirectory from './components/MemberDirectory';
import FacultyAttendanceEntry from './components/FacultyAttendanceEntry';
import SchedulePage from './components/SchedulePage';
import LeaveGateway from './components/LeaveGateway';
import ProfilePage from './components/ProfilePage';
import HomePage from './components/HomePage';
import CurriculumHub from './components/CurriculumHub';
import { api } from './api';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authView, setAuthView] = useState('home');
    const [userRole, setUserRole] = useState('Faculty');
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [students, setStudents] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [directoryActive, setDirectoryActive] = useState(false);
    const [autoConfig, setAutoConfig] = useState({
        autoAbsentActive: true,
        autoAbsentTime: '17:00',
        autoNotifyActive: true,
        autoResetTime: '00:00'
    });
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('portal_settings');
        const defaultSettings = {
            academicYear: '2023-2024',
            semester: 'Even',
            notifications: true,
            darkMode: false,
            autoBackup: false,
            emailAlerts: true
        };
        if (saved) {
            const parsed = JSON.parse(saved);
            return { ...parsed };
        }
        return defaultSettings;
    });

    useEffect(() => {
        localStorage.setItem('portal_settings', JSON.stringify(settings));
    }, [settings]);

    // Initial fetch from backend
    useEffect(() => {
        loadStudents();
        loadUsers();
        loadSystemConfig();
    }, []);

    const loadSystemConfig = async () => {
        try {
            const data = await api.getSystemConfig();
            setAutoConfig(data);
        } catch (error) {
            console.error("Failed to load system config:", error);
        }
    };

    const handleRefreshDirectory = async () => {
        setIsLoading(true);
        await loadStudents();
        setDirectoryActive(true);
    };

    const loadStudents = async () => {
        try {
            const data = await api.getStudents();
            setStudents(data);
        } catch (error) {
            console.error("Failed to load students:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users:", error);
        }
    };

    // Search logic with animation trigger
    useEffect(() => {
        if (searchQuery.length > 0) {
            setIsSearching(true);
            const timer = setTimeout(() => setIsSearching(false), 800);
            return () => clearTimeout(timer);
        }
    }, [searchQuery]);

    const handleStatusChange = async (idOrUser, newStatus, branch, semester, section, subject) => {
        const time = newStatus === 'Absent' ? '-' : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        try {
            let targetId = idOrUser;

            // If we received a user object instead of an ID, it means the student needs a record created
            if (typeof idOrUser === 'object' && idOrUser !== null) {
                const newStudent = await api.addStudent({
                    name: idOrUser.username,
                    roll: idOrUser.rollNumber,
                    parentPhoneNumber: idOrUser.phoneNumber,
                    status: newStatus,
                    time: time,
                    branch,
                    semester,
                    section,
                    subject
                });
                targetId = newStudent.id;
                setStudents(prev => [...prev, newStudent]);
            } else {
                const updatedStudent = await api.updateStudentStatus(targetId, newStatus, time, branch, semester, section, subject);
                setStudents(prev => prev.map(s =>
                    s.id === targetId ? updatedStudent : s
                ));
            }

            if (newStatus === 'Present') {
                alert('the student is present');
            } else if (newStatus === 'Absent') {
                alert('the student is absent');
            }
        } catch (error) {
            alert('Error updating status: ' + error.message);
        }
    };

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        setIsAuthenticated(true);

        if (user.role === 'ADMIN') {
            setUserRole('Admin');
            setActiveTab('admin-dashboard');
        } else if (user.role === 'HOD') {
            setUserRole('HOD');
            setActiveTab('hod-dashboard');
        } else if (user.role === 'STUDENT') {
            setUserRole('Student');
            setActiveTab('student-dashboard');
        } else {
            setUserRole('Faculty');
            setActiveTab('faculty-dashboard');
        }
    };

    const handleRegisterSuccess = () => {
        setAuthView('register-success');
    };

    const logout = () => {
        setIsAuthenticated(false);
        setAuthView('login');
        setCurrentUser(null);
    };

    const handleNavigate = (tab) => {
        if (tab === 'students' && !directoryActive) {
            handleRefreshDirectory();
        }
        setActiveTab(tab);
    };

    const handleDeleteAccount = async () => {
        if (!currentUser || !currentUser.id) {
            alert('Unable to delete account: User information not found.');
            return;
        }

        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await api.deleteAccount(currentUser.id);
                alert('Your account has been successfully deleted.');
                logout();
            } catch (error) {
                console.error('Delete account error:', error);
                alert('Failed to delete account: ' + error.message);
            }
        }
    };



    const handleUpdateStudent = async (id, updatedData) => {
        try {
            // Find current student to check if status changed
            const currentStudent = students.find(s => s.id === id);

            // If status changed, we should also update the timestamp
            if (updatedData.status && currentStudent && updatedData.status !== currentStudent.status) {
                updatedData.time = updatedData.status === 'Absent' ? '-' : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }

            const updatedStudent = await api.updateStudent(id, updatedData);
            setStudents(prev => prev.map(s =>
                s.id === id ? updatedStudent : s
            ));
            alert('Student registry updated successfully');
        } catch (error) {
            alert('Error updating student: ' + error.message);
        }
    };


    if (!isAuthenticated) {
        if (authView === 'home') {
            return (
                <HomePage 
                    onLogin={() => setAuthView('login')}
                    onRegister={() => setAuthView('register')}
                    onDashboard={() => setAuthView('login')}
                    isAuthenticated={false}
                />
            );
        } else if (authView === 'login') {
            return (
                <LoginPage
                    onLogin={handleLoginSuccess}
                    onSwitchToRegister={() => setAuthView('register')}
                    onBackToHome={() => setAuthView('home')}
                />
            );
        } else if (authView === 'register') {
            return (
                <RegisterPage
                    onRegister={handleRegisterSuccess}
                    onSwitchToLogin={() => setAuthView('login')}
                    onBackToHome={() => setAuthView('home')}
                />
            );
        } else if (authView === 'register-success') {
            return (
                <RegisterSuccess 
                    onContinue={() => setAuthView('login')}
                />
            );
        }
        return null;
    }

    return (
        <div className={settings.darkMode ? 'dark' : ''}>
            <Layout
                activeTab={activeTab}
                setActiveTab={handleNavigate}
                logout={logout}
                user={currentUser}
                onDeleteAccount={handleDeleteAccount}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            >
            {activeTab === 'home' && (
                <HomePage 
                    onLogin={() => {}} 
                    onRegister={() => {}} 
                    onDashboard={() => {
                        if (userRole === 'Admin') handleNavigate('admin-dashboard');
                        else if (userRole === 'HOD') handleNavigate('hod-dashboard');
                        else if (userRole === 'Student') handleNavigate('student-dashboard');
                        else handleNavigate('faculty-dashboard');
                    }} 
                    isAuthenticated={true} 
                    hideNavbar={true}
                />
            )}
            {activeTab === 'admin-dashboard' && <AdminDashboard user={currentUser} users={users} students={students} onNavigate={handleNavigate} searchQuery={searchQuery} settings={settings} setSettings={setSettings} onDeleteAccount={handleDeleteAccount} />}
            {activeTab === 'hod-dashboard' && <HodDashboard user={currentUser} onNavigate={handleNavigate} students={students} onUpdateStudent={handleUpdateStudent} searchQuery={searchQuery} settings={settings} setSettings={setSettings} onDeleteAccount={handleDeleteAccount} />}
            {activeTab === 'faculty-dashboard' && <FacultyDashboard user={currentUser} onNavigateToAttendance={handleNavigate} students={students} searchQuery={searchQuery} settings={settings} setSettings={setSettings} onDeleteAccount={handleDeleteAccount} />}
            {activeTab === 'student-dashboard' && <StudentDashboard user={currentUser} students={students} onStatusChange={handleStatusChange} onNavigate={handleNavigate} searchQuery={searchQuery} settings={settings} setSettings={setSettings} onDeleteAccount={handleDeleteAccount} />}
            {(activeTab === 'dashboard' || activeTab === 'analytics') && <Dashboard students={students} searchQuery={searchQuery} isSearching={isSearching} />}
            {activeTab === 'reports' && <ReportPage records={students} />}
            {(activeTab === 'attendance' || activeTab === 'quick-mark' || activeTab === 'attenditics' || activeTab === 'faculty-attendance') && (
                <div className="max-w-5xl mx-auto">
                    <AttendancePanel
                        students={students}
                        updateStatus={handleStatusChange}
                        onUpdateStudent={handleUpdateStudent}
                        searchQuery={searchQuery}
                    />
                </div>
            )}


            {activeTab === 'leave' && <LeaveGateway user={currentUser} />}

            {(activeTab === 'settings' || activeTab === 'portal-settings') && (
                <PortalSettings 
                    user={currentUser}
                    settings={settings}
                    setSettings={setSettings}
                    autoConfig={autoConfig}
                    setAutoConfig={setAutoConfig}
                    onDeleteAccount={handleDeleteAccount} 
                    onSyncRegistry={handleRefreshDirectory} 
                />
            )}
            {activeTab === 'profile' && <ProfilePage user={currentUser} onDeleteAccount={handleDeleteAccount} />}

            {activeTab === 'schedule' && <SchedulePage user={currentUser} students={students} />}

            {activeTab === 'curriculum' && <CurriculumHub />}

            {['students', 'admissions', 'faculty-management', 'employees'].includes(activeTab) && (
                directoryActive ? (
                    <MemberDirectory students={students} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-[60vh] flex flex-col items-center justify-center card relative overflow-hidden group px-8 text-center"
                        style={{ background: 'var(--bg-primary)', borderStyle: 'dashed', borderWidth: '2px' }}
                    >
                        <div className="absolute inset-0 bg-radial-at-c from-indigo-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        <div className="relative mb-10">
                            <div style={{ width: '80px', height: '80px', background: 'var(--primary-light)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', boxShadow: 'var(--shadow-md)' }}>
                                <Grid3X3 size={40} />
                            </div>
                            <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '32px', height: '32px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning-color)', boxShadow: 'var(--shadow-sm)' }}>
                                <Clock size={16} />
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Student Registry <span className="text-indigo-600">Offline</span></h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '1rem', maxWidth: '320px', fontWeight: 500 }}>
                            Connect to the central database to synchronize and view student records.
                        </p>

                        <div className="flex flex-col items-center gap-6 mt-12">
                            <button
                                onClick={handleRefreshDirectory}
                                disabled={isLoading}
                                className="btn-primary px-10 h-12 flex items-center gap-3"
                            >
                                <Plus size={18} />
                                <span className="text-sm font-bold">
                                    {isLoading ? 'Loading Students...' : 'View Student Directory'}
                                </span>
                            </button>

                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-500" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Database Connection Required</span>
                            </div>
                        </div>
                    </motion.div>
                )
            )}
        </Layout>
        </div>
    );
}

export default App;
