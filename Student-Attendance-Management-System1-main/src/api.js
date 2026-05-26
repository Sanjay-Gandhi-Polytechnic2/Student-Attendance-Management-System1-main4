const API_BASE_URL = 'http://localhost:9040/api';

// Helper to detect any network/connection error regardless of browser wording
function isNetworkError(error) {
    return (
        error instanceof TypeError ||
        error.message === 'Failed to fetch' ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('ERR_CONNECTION_REFUSED') ||
        error.message.includes('net::ERR') ||
        error.name === 'TypeError'
    );
}

export const api = {
    // Auth endpoints
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Invalid credentials');
            }
            return response.json();
        } catch (error) {
            console.error('Login error:', error);
            if (isNetworkError(error)) {
                throw new Error('Backend server is unreachable. Please ensure the Spring Boot application is running on port 9040.');
            }
            throw error;
        }
    },

    async forgotPassword(email) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg || 'Recovery request failed');
            }
            return response.json();
        } catch (error) {
            console.error('Forgot password error:', error);
            if (isNetworkError(error)) {
                throw new Error('Backend server is unreachable. Please ensure the Spring Boot application is running on port 9040.');
            }
            throw error;
        }
    },

    async forgotUsername(email) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-username`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg || 'Username recovery failed');
            }
            return response.json();
        } catch (error) {
            console.error('Forgot username error:', error);
            if (isNetworkError(error)) {
                throw new Error('Backend server is unreachable. Please ensure the Spring Boot application is running on port 9040.');
            }
            throw error;
        }
    },

    async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Registration failed');
            }
            return response.json();
        } catch (error) {
            console.error('Registration error:', error);
            if (isNetworkError(error)) {
                throw new Error('Backend server is unreachable. Please ensure the Spring Boot application is running on port 9040.');
            }
            throw error;
        }
    },

    async deleteAccount(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/delete/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete account: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Delete account error:', error);
            throw error;
        }
    },

    async updatePassword(userId, oldPassword, newPassword) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/update-password/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword, newPassword })
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Failed to update password');
            }

            return await response.json();
        } catch (error) {
            console.error('Update password error:', error);
            if (isNetworkError(error)) {
                throw new Error('Backend server is unreachable. Please ensure the Spring Boot application is running on port 9040.');
            }
            throw error;
        }
    },

    async getUsers() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            return response.json();
        } catch (error) {
            console.error('Fetch users error:', error);
            throw error;
        }
    },

    // Student endpoints
    async getStudents() {
        try {
            const response = await fetch(`${API_BASE_URL}/students`);
            if (!response.ok) throw new Error('Failed to fetch students');
            return response.json();
        } catch (error) {
            console.error('Fetch students error:', error);
            throw error;
        }
    },

    async updateStudentStatus(id, status, time, branch, semester, section, subject) {
        try {
            const response = await fetch(`${API_BASE_URL}/students/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, time, branch, semester, section, subject })
            });
            if (!response.ok) throw new Error('Failed to update status');
            return response.json();
        } catch (error) {
            console.error('Update status error:', error);
            throw error;
        }
    },

    async updateStudent(id, studentData) {
        try {
            const response = await fetch(`${API_BASE_URL}/students/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
            if (!response.ok) throw new Error('Failed to update student');
            return response.json();
        } catch (error) {
            console.error('Update student error:', error);
            throw error;
        }
    },
    async searchStudents(query) {
        try {
            const response = await fetch(`${API_BASE_URL}/students/search?query=${query}`);
            if (!response.ok) throw new Error('Search failed');
            return response.json();
        } catch (error) {
            console.error('Search students error:', error);
            throw error;
        }
    },

    async addStudent(studentData) {
        try {
            const response = await fetch(`${API_BASE_URL}/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
            if (!response.ok) throw new Error('Failed to add student');
            return response.json();
        } catch (error) {
            console.error('Add student error:', error);
            throw error;
        }
    },

    // Leave Request endpoints
    async getLeaveRequests() {
        try {
            const response = await fetch(`${API_BASE_URL}/leave-requests`);
            if (!response.ok) throw new Error('Failed to fetch leave requests');
            return response.json();
        } catch (error) {
            console.error('Fetch leave requests error:', error);
            throw error;
        }
    },

    async getFacultyLeaveRequests(facultyId) {
        try {
            const response = await fetch(`${API_BASE_URL}/leave-requests/faculty/${facultyId}`);
            if (!response.ok) throw new Error('Failed to fetch faculty leave requests');
            return response.json();
        } catch (error) {
            console.error('Fetch faculty leave requests error:', error);
            throw error;
        }
    },

    async createLeaveRequest(requestData) {
        try {
            const response = await fetch(`${API_BASE_URL}/leave-requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to create leave request');
            }
            return response.json();
        } catch (error) {
            console.error('Create leave request error:', error);
            throw error;
        }
    },

    async updateLeaveRequestStatus(id, status) {
        try {
            const response = await fetch(`${API_BASE_URL}/leave-requests/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (!response.ok) throw new Error('Failed to update leave request status');
            return response.json();
        } catch (error) {
            console.error('Update leave request status error:', error);
            throw error;
        }
    },

    // System Config endpoints
    async getSystemConfig() {
        try {
            const response = await fetch(`${API_BASE_URL}/config`);
            if (!response.ok) throw new Error('Failed to fetch system configurations');
            return response.json();
        } catch (error) {
            console.error('Get system config error:', error);
            throw error;
        }
    },

    async updateSystemConfig(configData) {
        try {
            const response = await fetch(`${API_BASE_URL}/config`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(configData)
            });
            if (!response.ok) throw new Error('Failed to update system configurations');
            return response.json();
        } catch (error) {
            console.error('Update system config error:', error);
            throw error;
        }
    },

    async simulateSweep() {
        try {
            const response = await fetch(`${API_BASE_URL}/config/simulate-sweep`, {
                method: 'POST'
            });
            if (!response.ok) throw new Error('Failed to execute sweep simulation');
            return response.json();
        } catch (error) {
            console.error('Sweep simulation error:', error);
            throw error;
        }
    },

    async simulateReset() {
        try {
            const response = await fetch(`${API_BASE_URL}/config/simulate-reset`, {
                method: 'POST'
            });
            if (!response.ok) throw new Error('Failed to execute reset simulation');
            return response.json();
        } catch (error) {
            console.error('Reset simulation error:', error);
            throw error;
        }
    },

    async getSchedules(branch, semester, teacherName) {
        try {
            let url = `${API_BASE_URL}/schedule`;
            const params = [];
            if (branch && semester) {
                params.push(`branch=${encodeURIComponent(branch)}`);
                params.push(`semester=${encodeURIComponent(semester)}`);
            } else if (teacherName) {
                params.push(`teacherName=${encodeURIComponent(teacherName)}`);
            }
            if (params.length > 0) {
                url += `?${params.join('&')}`;
            }
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch schedule slots');
            return response.json();
        } catch (error) {
            console.error('Fetch schedule error:', error);
            throw error;
        }
    },

    async createScheduleSlot(slotData) {
        try {
            const response = await fetch(`${API_BASE_URL}/schedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(slotData)
            });
            if (!response.ok) throw new Error('Failed to create schedule slot');
            return response.json();
        } catch (error) {
            console.error('Create schedule slot error:', error);
            throw error;
        }
    },

    async updateScheduleSlot(id, slotData) {
        try {
            const response = await fetch(`${API_BASE_URL}/schedule/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(slotData)
            });
            if (!response.ok) throw new Error('Failed to update schedule slot');
            return response.json();
        } catch (error) {
            console.error('Update schedule slot error:', error);
            throw error;
        }
    },

    async deleteScheduleSlot(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/schedule/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete schedule slot');
            return true;
        } catch (error) {
            console.error('Delete schedule slot error:', error);
            throw error;
        }
    },

    async getSmsLogs() {
        try {
            const response = await fetch(`${API_BASE_URL}/sms/logs`);
            if (!response.ok) throw new Error('Failed to fetch SMS logs');
            return response.json();
        } catch (error) {
            console.error('Fetch SMS logs error:', error);
            throw error;
        }
    },

    async sendTestSms(phone, studentName, message) {
        try {
            const response = await fetch(`${API_BASE_URL}/sms/send-test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, studentName, message })
            });
            if (!response.ok) throw new Error('Failed to dispatch test SMS');
            return response.json();
        } catch (error) {
            console.error('Send test SMS error:', error);
            throw error;
        }
    }
};


