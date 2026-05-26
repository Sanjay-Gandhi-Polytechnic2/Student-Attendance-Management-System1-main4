package com.attendflow.backend.config;

import com.attendflow.backend.model.Student;
import com.attendflow.backend.model.User;
import com.attendflow.backend.model.SystemConfig;
import com.attendflow.backend.model.TimetableSlot;
import com.attendflow.backend.repository.StudentRepository;
import com.attendflow.backend.repository.UserRepository;
import com.attendflow.backend.repository.SystemConfigRepository;
import com.attendflow.backend.repository.TimetableSlotRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(StudentRepository studentRepository, UserRepository userRepository, SystemConfigRepository systemConfigRepository, TimetableSlotRepository timetableSlotRepository) {
        return args -> {
            System.out.println("--- Starting Database Initialization ---");

            // Initial Students
            if (studentRepository.count() == 0) {
                List<Student> initialStudents = new ArrayList<>(Arrays.asList(
                        new Student(null, "Alice Johnson", "CS001", "DCS", "DCS", "1", "FOC", "Present", "08:45 AM", "+1234567890", 0, 0),
                        new Student(null, "Bob Smith", "ME002", "DME", "DME", "1", "FOC", "Present", "08:50 AM", "+1234567891", 0, 0),
                        new Student(null, "Charlie Brown", "EE003", "DEEE", "DEEE", "1", "FOC", "Late", "09:15 AM", "+1234567892", 0, 0),
                        new Student(null, "Diana Prince", "CE004", "DCE", "DCE", "1", "FOC", "Absent", "-", "+1234567893", 0, 0),
                        new Student(null, "Ethan Hunt", "MT005", "DMT", "DMT", "1", "FOC", "Present", "08:40 AM", "+1234567894", 0, 0)));
                studentRepository.saveAll(initialStudents);
                System.out.println("Inserted 5 default students across new branches.");
            } else {
                System.out.println("Students already exist. Skipping student initialization.");
            }

            // Default Admin, Teacher, and HOD
            if (userRepository.count() == 0) {
                userRepository.save(new User(null, "admin", "admin123", "admin@sgpb.edu.in", "ADMIN", null, null));
                userRepository
                        .save(new User(null, "teacher", "teacher123", "teacher@sgpb.edu.in", "TEACHER", null, null));
                userRepository.save(new User(null, "hod", "hod123", "hod@sgpb.edu.in", "HOD", null, null));
                System.out.println("Inserted default administrative personnel.");
            } else {
                System.out.println("Users already exist. Skipping user initialization.");
            }

            // Default Automatic Attendance Configuration
            if (systemConfigRepository.count() == 0) {
                systemConfigRepository.save(new SystemConfig(1L, true, "17:00", true, true, "00:00"));
                System.out.println("Inserted default automatic attendance configuration.");
            } else {
                System.out.println("System configuration already exists. Skipping initialization.");
            }

            // Default Timetable Slots
            if (timetableSlotRepository.count() <= 8) {
                if (timetableSlotRepository.count() > 0) {
                    timetableSlotRepository.deleteAll();
                    System.out.println("Cleaned up old 8-slot timetable configuration.");
                }
                List<TimetableSlot> initialSlots = Arrays.asList(
                        // Monday
                        new TimetableSlot(null, "MON", "09:00 AM - 10:00 AM", "Advanced Mathematics", "RL-301", "teacher", "DCS", "1", "#6366f1"),
                        new TimetableSlot(null, "MON", "10:00 AM - 11:00 AM", "Cloud Computing Infrastructure", "LAB-04", "Prof. A. Verma", "DCS", "1", "#10b981"),
                        new TimetableSlot(null, "MON", "11:00 AM - 12:00 PM", "Network Security", "RL-305", "Prof. R. Kumar", "DCS", "1", "#8b5cf6"),
                        new TimetableSlot(null, "MON", "12:00 PM - 01:00 PM", "Institutional Protocol", "HALL-A", "Dr. K. Gupta", "DCS", "1", "#f59e0b"),
                        new TimetableSlot(null, "MON", "02:00 PM - 03:00 PM", "Cryptography & Security", "RL-302", "Prof. M. Khan", "DCS", "1", "#ef4444"),
                        
                        // Tuesday
                        new TimetableSlot(null, "TUE", "09:00 AM - 10:00 AM", "Network Security", "RL-305", "Prof. R. Kumar", "DCS", "1", "#8b5cf6"),
                        new TimetableSlot(null, "TUE", "10:00 AM - 11:00 AM", "Advanced Mathematics", "RL-301", "teacher", "DCS", "1", "#6366f1"),
                        new TimetableSlot(null, "TUE", "11:00 AM - 12:00 PM", "Cloud Computing Infrastructure", "LAB-04", "Prof. A. Verma", "DCS", "1", "#10b981"),
                        
                        // Wednesday
                        new TimetableSlot(null, "WED", "09:00 AM - 10:00 AM", "Web Technologies Lab", "LAB-03", "Prof. S. Sharma", "DCS", "1", "#06b6d4"),
                        new TimetableSlot(null, "WED", "10:00 AM - 11:00 AM", "Digital Logic Design", "RL-303", "Prof. A. Bose", "DCS", "1", "#f59e0b"),
                        new TimetableSlot(null, "WED", "11:00 AM - 12:00 PM", "Data Structures & Algorithms", "RL-305", "Dr. P. Mehta", "DCS", "1", "#8b5cf6"),
                        new TimetableSlot(null, "WED", "12:00 PM - 01:00 PM", "Advanced Mathematics", "RL-301", "teacher", "DCS", "1", "#6366f1"),

                        // Thursday
                        new TimetableSlot(null, "THU", "09:00 AM - 10:00 AM", "Cryptography & Security", "RL-302", "Prof. M. Khan", "DCS", "1", "#ef4444"),
                        new TimetableSlot(null, "THU", "10:00 AM - 11:00 AM", "Data Structures & Algorithms", "RL-305", "Dr. P. Mehta", "DCS", "1", "#8b5cf6"),
                        new TimetableSlot(null, "THU", "11:00 AM - 12:00 PM", "Institutional Protocol", "HALL-A", "Dr. K. Gupta", "DCS", "1", "#f59e0b"),
                        new TimetableSlot(null, "THU", "02:00 PM - 03:00 PM", "Network Security", "RL-305", "Prof. R. Kumar", "DCS", "1", "#8b5cf6"),

                        // Friday
                        new TimetableSlot(null, "FRI", "09:00 AM - 10:00 AM", "Cloud Computing Infrastructure", "LAB-04", "Prof. A. Verma", "DCS", "1", "#10b981"),
                        new TimetableSlot(null, "FRI", "10:00 AM - 11:00 AM", "Web Technologies Lab", "LAB-03", "Prof. S. Sharma", "DCS", "1", "#06b6d4"),
                        new TimetableSlot(null, "FRI", "11:00 AM - 12:00 PM", "Digital Logic Design", "RL-303", "Prof. A. Bose", "DCS", "1", "#f59e0b"),
                        new TimetableSlot(null, "FRI", "12:00 PM - 01:00 PM", "Cryptography & Security", "RL-302", "Prof. M. Khan", "DCS", "1", "#ef4444"),

                        // Saturday
                        new TimetableSlot(null, "SAT", "09:00 AM - 10:00 AM", "Advanced Mathematics", "RL-301", "teacher", "DCS", "1", "#6366f1"),
                        new TimetableSlot(null, "SAT", "10:00 AM - 11:00 AM", "Network Security Lab", "LAB-02", "Prof. R. Kumar", "DCS", "1", "#8b5cf6"),
                        new TimetableSlot(null, "SAT", "11:00 AM - 12:00 PM", "Technical Seminar", "AUD-01", "Dr. K. Gupta", "DCS", "1", "#ec4899")
                );
                timetableSlotRepository.saveAll(initialSlots);
                System.out.println("Inserted comprehensive default timetable slots (Mon-Sat).");
            } else {
                System.out.println("Timetable slots already exist. Skipping initialization.");
            }

            System.out.println("--- Database Initialization Complete ---");
        };
    }
}

