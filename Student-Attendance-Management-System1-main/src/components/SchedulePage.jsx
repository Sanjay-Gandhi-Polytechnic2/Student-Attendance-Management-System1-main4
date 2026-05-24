import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, BookOpen, ChevronLeft, ChevronRight, Plus, Trash2, Edit3, X, Save, Sparkles, Filter } from 'lucide-react';
import { api } from '../api';

const SchedulePage = ({ user, students = [] }) => {
    const [activeDay, setActiveDay] = useState('MON');
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [myScheduleOnly, setMyScheduleOnly] = useState(false);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);
    const [formData, setFormData] = useState({
        dayOfWeek: 'MON',
        timeSlot: '09:00 AM - 10:00 AM',
        subject: '',
        room: '',
        teacherName: '',
        branch: 'ALL',
        semester: 'ALL',
        color: '#6366f1'
    });

    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    // Preset color palette for premium design
    const colors = [
        { hex: '#6366f1', name: 'Indigo' },
        { hex: '#10b981', name: 'Emerald' },
        { hex: '#8b5cf6', name: 'Violet' },
        { hex: '#f59e0b', name: 'Amber' },
        { hex: '#ef4444', name: 'Rose' },
        { hex: '#ec4899', name: 'Pink' },
        { hex: '#06b6d4', name: 'Cyan' },
        { hex: '#64748b', name: 'Slate' }
    ];

    const isAuthorized = user?.role === 'ADMIN' || user?.role === 'HOD';
    const isTeacher = user?.role === 'TEACHER';
    const isStudent = user?.role === 'STUDENT';

    // Find student record if applicable
    const studentRecord = isStudent
        ? students.find(s => s.name === user?.username || s.roll === user?.rollNumber)
        : null;

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const data = await api.getSchedules();
            setSlots(data);
            setError(null);
        } catch (err) {
            console.error('Failed to load schedule:', err);
            setError('Could not establish synchronization with central timetable logs.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setEditingSlot(null);
        setFormData({
            dayOfWeek: activeDay,
            timeSlot: '09:00 AM - 10:00 AM',
            subject: '',
            room: '',
            teacherName: user?.role === 'TEACHER' ? user.username : '',
            branch: studentRecord?.branch || 'ALL',
            semester: studentRecord?.semester || 'ALL',
            color: '#6366f1'
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (slot) => {
        setEditingSlot(slot);
        setFormData({
            dayOfWeek: slot.dayOfWeek,
            timeSlot: slot.timeSlot,
            subject: slot.subject,
            room: slot.room,
            teacherName: slot.teacherName,
            branch: slot.branch,
            semester: slot.semester,
            color: slot.color
        });
        setIsModalOpen(true);
    };

    const handleDeleteSlot = async (id) => {
        if (window.confirm('Are you sure you want to delete this schedule period?')) {
            try {
                await api.deleteScheduleSlot(id);
                setSlots(prev => prev.filter(s => s.id !== id));
            } catch (err) {
                alert('Failed to delete timetable period: ' + err.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSlot) {
                const updated = await api.updateScheduleSlot(editingSlot.id, formData);
                setSlots(prev => prev.map(s => s.id === editingSlot.id ? updated : s));
            } else {
                const created = await api.createScheduleSlot(formData);
                setSlots(prev => [...prev, created]);
            }
            setIsModalOpen(false);
        } catch (err) {
            alert('Failed to save timetable period: ' + err.message);
        }
    };

    // Client-side filtering logic
    const filteredSlots = slots.filter(slot => {
        // 1. Day of week check
        if (slot.dayOfWeek !== activeDay) return false;

        // 2. Student context: only show slots matching their branch and semester (or ALL)
        if (isStudent && studentRecord) {
            const branchMatch = slot.branch === 'ALL' || slot.branch === studentRecord.branch;
            const semesterMatch = slot.semester === 'ALL' || slot.semester === studentRecord.semester;
            if (!branchMatch || !semesterMatch) return false;
        }

        // 3. Teacher context / filter: only show slots where teacher matches
        if (myScheduleOnly && user) {
            const matchesTeacher = slot.teacherName?.toLowerCase() === user.username?.toLowerCase();
            if (!matchesTeacher) return false;
        }

        return true;
    });

    return (
        <div className="animate-fade space-y-8">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Academic Routine</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {isStudent && studentRecord 
                            ? `Personalized schedule for ${studentRecord.branch} Semester ${studentRecord.semester}`
                            : 'Centralized schedule and node occupancy trace'
                        }
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {isTeacher && (
                        <button
                            className={`btn ${myScheduleOnly ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setMyScheduleOnly(!myScheduleOnly)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px' }}
                        >
                            <Filter size={16} />
                            <span>{myScheduleOnly ? 'Showing My Sessions' : 'Show My Sessions Only'}</span>
                        </button>
                    )}

                    {isAuthorized && (
                        <button
                            className="btn btn-primary"
                            onClick={handleOpenAddModal}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px' }}
                        >
                            <Plus size={18} />
                            <span>Add Period</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Day Selector */}
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'thin' }}>
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        style={{
                            minWidth: '90px', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)',
                            background: activeDay === day ? 'var(--primary-gradient)' : 'white',
                            color: activeDay === day ? 'white' : 'var(--text-primary)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                            cursor: 'pointer', transition: 'all 0.3s', boxShadow: activeDay === day ? 'var(--shadow-md)' : 'none'
                        }}
                    >
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, opacity: activeDay === day ? 0.9 : 0.6 }}>SESSION</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>{day}</span>
                    </button>
                ))}
            </div>

            {/* Timetable Slots Listing */}
            {loading ? (
                <div style={{ padding: '4rem', textCenter: 'center', display: 'flex', justifyContent: 'center' }}>
                    <div className="animate-pulse" style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>
                        Synchronizing Routine Data...
                    </div>
                </div>
            ) : error ? (
                <div className="card" style={{ borderLeft: '4px solid var(--error-color)', padding: '1.5rem' }}>
                    <p style={{ color: 'var(--error-color)', fontWeight: 700 }}>{error}</p>
                    <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={fetchSchedule}>
                        Retry Synchronization
                    </button>
                </div>
            ) : filteredSlots.length === 0 ? (
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem', textCenter: 'center', borderStyle: 'dashed', borderWidth: '2px' }}>
                    <div style={{ padding: '1rem', background: 'var(--primary-light)', color: 'var(--primary-color)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                        <Calendar size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>No Periods Programmed</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem', maxWidth: '300px', textAlign: 'center' }}>
                        No academic sessions have been scheduled for {activeDay} in this category.
                    </p>
                    {isAuthorized && (
                        <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={handleOpenAddModal}>
                            Schedule First Session
                        </button>
                    )}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredSlots.map((cls, idx) => (
                        <motion.div 
                            key={cls.id}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="card"
                            style={{ display: 'flex', gap: '2rem', alignItems: 'center', padding: '1.5rem 2rem', position: 'relative' }}
                        >
                            <div style={{ width: '120px', borderRight: '1px solid var(--border-color)', flexShrink: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', marginBottom: '0.25rem' }}>
                                    <Clock size={16} />
                                    <span style={{ fontSize: '0.875rem', fontWeight: 800 }}>TIME</span>
                                </div>
                                <p style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{cls.timeSlot}</p>
                            </div>

                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '12px', height: '40px', background: cls.color || '#6366f1', borderRadius: '4px', flexShrink: 0 }}></div>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{cls.subject}</h4>
                                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.8125rem', fontWeight: 600 }}>
                                            <BookOpen size={14} /> {cls.teacherName}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.8125rem', fontWeight: 600 }}>
                                            <MapPin size={14} /> Room: {cls.room}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <span className="badge badge-info" style={{ fontSize: '0.7rem', fontWeight: 800 }}>CLASS: {cls.branch}</span>
                                            <span className="badge badge-secondary" style={{ fontSize: '0.7rem', fontWeight: 800 }}>SEM: {cls.semester}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isAuthorized && (
                                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                                    <button 
                                        className="btn btn-secondary" 
                                        onClick={() => handleOpenEditModal(cls)}
                                        style={{ padding: '0.5rem', borderRadius: '10px' }}
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button 
                                        className="btn btn-secondary" 
                                        onClick={() => handleDeleteSlot(cls.id)}
                                        style={{ padding: '0.5rem', borderRadius: '10px', color: 'var(--error-color)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Timetable period CRUD Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card" 
                            style={{ maxWidth: '500px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Sparkles size={20} color="var(--primary-color)" />
                                    <h3 style={{ fontWeight: 800, fontSize: '1.25rem' }}>
                                        {editingSlot ? 'Refine Period details' : 'Configure New Period'}
                                    </h3>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label">Day of Week</label>
                                        <select 
                                            className="form-input" 
                                            value={formData.dayOfWeek}
                                            onChange={e => setFormData({ ...formData, dayOfWeek: e.target.value })}
                                            required
                                        >
                                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Time Interval</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            placeholder="e.g. 09:00 AM - 10:00 AM" 
                                            value={formData.timeSlot}
                                            onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Course Subject Name</label>
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="e.g. Advanced Cryptography" 
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        required 
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label">Lecture Room</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            placeholder="e.g. RL-305" 
                                            value={formData.room}
                                            onChange={e => setFormData({ ...formData, room: e.target.value })}
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Assigned Teacher</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            placeholder="e.g. Dr. S. Sharma" 
                                            value={formData.teacherName}
                                            onChange={e => setFormData({ ...formData, teacherName: e.target.value })}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label">Target Class / Branch</label>
                                        <select 
                                            className="form-input" 
                                            value={formData.branch}
                                            onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                        >
                                            <option value="ALL">ALL CLASSES</option>
                                            <option value="DCS">DCS (Computer Science)</option>
                                            <option value="DME">DME (Mechanical)</option>
                                            <option value="DEEE">DEEE (Electrical)</option>
                                            <option value="DCE">DCE (Civil)</option>
                                            <option value="DMT">DMT (Metallurgy)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Target Semester</label>
                                        <select 
                                            className="form-input" 
                                            value={formData.semester}
                                            onChange={e => setFormData({ ...formData, semester: e.target.value })}
                                        >
                                            <option value="ALL">ALL SEMESTERS</option>
                                            <option value="1">Semester 1</option>
                                            <option value="2">Semester 2</option>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                            <option value="5">Semester 5</option>
                                            <option value="6">Semester 6</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Visual Card Accent Color</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                        {colors.map(c => (
                                            <button
                                                key={c.hex}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color: c.hex })}
                                                style={{
                                                    width: '28px', height: '28px', borderRadius: '50%', background: c.hex,
                                                    border: formData.color === c.hex ? '2px solid var(--text-primary)' : '1px solid var(--border-color)',
                                                    cursor: 'pointer', transition: 'all 0.2s', transform: formData.color === c.hex ? 'scale(1.15)' : 'none'
                                                }}
                                                title={c.name}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary w-full"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-full"
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        <Save size={18} />
                                        <span>Save Routine</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SchedulePage;
