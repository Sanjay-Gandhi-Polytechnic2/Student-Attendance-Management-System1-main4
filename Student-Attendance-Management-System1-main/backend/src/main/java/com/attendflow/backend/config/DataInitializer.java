package com.attendflow.backend.config;

import com.attendflow.backend.model.Student;
import com.attendflow.backend.model.User;
import com.attendflow.backend.model.SystemConfig;
import com.attendflow.backend.repository.StudentRepository;
import com.attendflow.backend.repository.UserRepository;
import com.attendflow.backend.repository.SystemConfigRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(StudentRepository studentRepository, UserRepository userRepository, SystemConfigRepository systemConfigRepository) {
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
                systemConfigRepository.save(new SystemConfig(1L, true, "17:00", true, "00:00"));
                System.out.println("Inserted default automatic attendance configuration.");
            } else {
                System.out.println("System configuration already exists. Skipping initialization.");
            }

            System.out.println("--- Database Initialization Complete ---");
        };
    }
}

