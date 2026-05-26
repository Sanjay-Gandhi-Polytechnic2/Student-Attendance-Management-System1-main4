package com.attendflow.backend.service;

import com.attendflow.backend.model.Student;
import com.attendflow.backend.model.SystemConfig;
import com.attendflow.backend.model.User;
import com.attendflow.backend.repository.StudentRepository;
import com.attendflow.backend.repository.SystemConfigRepository;
import com.attendflow.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceAutomationService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SystemConfigRepository systemConfigRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SmsService smsService;

    private String lastSweepDate = "";
    private String lastResetDate = "";

    // Scheduled task to check automation configurations every 60 seconds
    @Scheduled(cron = "0 * * * * *")
    public void runAutomationChecks() {
        Optional<SystemConfig> configOpt = systemConfigRepository.findById(1L);
        if (!configOpt.isPresent()) {
            return;
        }
        SystemConfig config = configOpt.get();
        LocalDate today = LocalDate.now();
        String todayStr = today.toString();
        LocalTime now = LocalTime.now();

        // 1. Check Daily Sweep (Auto-Absent)
        if (config.isAutoAbsentActive() && !todayStr.equals(lastSweepDate)) {
            try {
                LocalTime sweepTime = LocalTime.parse(config.getAutoAbsentTime(), DateTimeFormatter.ofPattern("HH:mm"));
                if (now.isAfter(sweepTime) || now.equals(sweepTime)) {
                    System.out.println("[AUTOMATION] Triggering Scheduled Daily Sweep at " + now);
                    executeDailySweep(config.isAutoNotifyActive());
                    lastSweepDate = todayStr;
                }
            } catch (Exception e) {
                System.err.println("[AUTOMATION] Invalid autoAbsentTime format: " + config.getAutoAbsentTime());
            }
        }

        // 2. Check Daily Reset (Midnight Reset)
        if (!todayStr.equals(lastResetDate)) {
            try {
                LocalTime resetTime = LocalTime.parse(config.getAutoResetTime(), DateTimeFormatter.ofPattern("HH:mm"));
                if (now.isAfter(resetTime) || now.equals(resetTime)) {
                    System.out.println("[AUTOMATION] Triggering Scheduled Midnight Reset at " + now);
                    executeDailyReset();
                    lastResetDate = todayStr;
                }
            } catch (Exception e) {
                System.err.println("[AUTOMATION] Invalid autoResetTime format: " + config.getAutoResetTime());
            }
        }
    }

    public int executeDailySweep(boolean notifyParents) {
        List<Student> students = studentRepository.findAll();
        int sweepCount = 0;

        for (Student student : students) {
            // Sweep students whose status is "Unknown", "Pending", or empty/null
            String status = student.getStatus();
            if (status == null || status.trim().isEmpty() || "Unknown".equalsIgnoreCase(status) || "Pending".equalsIgnoreCase(status)) {
                student.setStatus("Absent");
                student.setAbsentCount(student.getAbsentCount() + 1);
                student.setTime("-");
                studentRepository.save(student);
                sweepCount++;

                if (notifyParents) {
                    dispatchParentNotification(student);
                }
            }
        }
        System.out.println("[AUTOMATION] Swept " + sweepCount + " student records to 'Absent'.");
        return sweepCount;
    }

    public int executeDailyReset() {
        List<Student> students = studentRepository.findAll();
        for (Student student : students) {
            student.setStatus("Unknown");
            student.setTime("-");
            studentRepository.save(student);
        }
        System.out.println("[AUTOMATION] Reset all student daily statuses to 'Unknown'.");
        return students.size();
    }

    private void dispatchParentNotification(Student student) {
        // Find student user record to fetch their institutional email
        Optional<User> userOpt = userRepository.findByUsername(student.getName());
        if (!userOpt.isPresent() && student.getRoll() != null) {
            // Fallback: search by roll number
            List<User> users = userRepository.findAll();
            userOpt = users.stream()
                    .filter(u -> student.getRoll().equalsIgnoreCase(u.getRollNumber()))
                    .findFirst();
        }

        String recipientEmail = "shaikirshan78@gmail.com"; // institution/parent default fallback
        if (userOpt.isPresent() && userOpt.get().getEmail() != null) {
            recipientEmail = userOpt.get().getEmail();
        }

        try {
            String subject = "Automated Attendance Alert - Sanjay Gandhi Polytechnic";
            String body = "Dear Parent/Guardian of " + student.getName() + ",\n\n" +
                    "This is an automated institutional telemetry alert from AttendanceFlow.\n\n" +
                    "Your ward, " + student.getName() + " (Roll: " + student.getRoll() + "), " +
                    "has been marked ABSENT for today's classes as they did not check-in before the portal cutoff time.\n\n" +
                    "Please contact the SGP administration if you believe this is an error.\n\n" +
                    "Regards,\n" +
                    "SGP Attendance Operations";

            emailService.sendEmail(recipientEmail, subject, body);
            System.out.println("[AUTOMATION] Automated absence alert email dispatched for " + student.getName() + " to " + recipientEmail);
        } catch (Exception e) {
            System.err.println("[AUTOMATION] Failed to dispatch automated alert for " + student.getName() + ": " + e.getMessage());
        }

        try {
            Optional<SystemConfig> configOpt = systemConfigRepository.findById(1L);
            if (configOpt.isPresent() && configOpt.get().isSmsNotifyActive()) {
                smsService.sendAttendanceAlert(student, "Absent");
            }
        } catch (Exception smsEx) {
            System.err.println("[AUTOMATION] Failed to dispatch automated SMS for " + student.getName() + ": " + smsEx.getMessage());
        }
    }
}
