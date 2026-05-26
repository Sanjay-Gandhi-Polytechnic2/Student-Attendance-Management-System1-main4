package com.attendflow.backend.service;

import com.attendflow.backend.model.SmsLog;
import com.attendflow.backend.model.Student;
import com.attendflow.backend.repository.SmsLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class SmsService {

    @Autowired
    private SmsLogRepository smsLogRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Dispatch an SMS message via Textbelt Free API.
     * If the free quota limit is reached or the dispatch fails, it falls back to simulated mode.
     */
    public boolean sendSms(String phoneNumber, String studentName, String messageContent) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            System.err.println("[SMS SERVICE] Recipient phone number is empty. Cannot dispatch alert.");
            return false;
        }

        String formattedTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm a"));
        String status = "SIMULATED / TEST";

        // Try calling the Textbelt Free API
        try {
            String url = "https://textbelt.com/text";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("phone", phoneNumber);
            requestBody.put("message", messageContent);
            requestBody.put("key", "textbelt"); // default Textbelt key for free tier

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                Map<?, ?> body = response.getBody();
                if (body != null) {
                    Boolean isSuccess = (Boolean) body.get("success");
                    if (Boolean.TRUE.equals(isSuccess)) {
                        status = "DELIVERED (TEXTBELT)";
                        System.out.println("[SMS SERVICE] Successfully dispatched real SMS to parent of " + studentName + " via Textbelt Free API.");
                    } else {
                        String error = (String) body.get("error");
                        System.out.println("[SMS SERVICE] Textbelt API rejected dispatch: " + error + ". Falling back to Simulation.");
                    }
                } else {
                    System.out.println("[SMS SERVICE] Bad response body from Textbelt. Falling back to Simulation.");
                }
            } else {
                System.out.println("[SMS SERVICE] Bad HTTP response status from Textbelt. Falling back to Simulation.");
            }
        } catch (Exception e) {
            System.out.println("[SMS SERVICE] Error attempting real SMS dispatch (" + e.getMessage() + "). Falling back to Simulation.");
        }

        // Save log to the database
        try {
            SmsLog log = new SmsLog(null, phoneNumber, studentName, messageContent, formattedTime, status);
            smsLogRepository.save(log);
        } catch (Exception dbEx) {
            System.err.println("[SMS SERVICE] Failed to record SMS log to database: " + dbEx.getMessage());
        }

        return "DELIVERED (TEXTBELT)".equals(status);
    }

    /**
     * Compose and dispatch a standard parent/guardian attendance alert for marked student statuses.
     */
    public void sendAttendanceAlert(Student student, String status) {
        String phone = student.getParentPhoneNumber();
        if (phone == null || phone.trim().isEmpty() || "-".equals(phone)) {
            // Fallback phone number
            phone = "+919876543210";
        }

        String studentName = student.getName();
        String roll = student.getRoll();
        String branch = student.getBranch();

        String message = String.format(
            "Dear Parent, your ward %s (%s, %s) has been marked %s for today's classes at Sanjay Gandhi Polytechnic. SGP AttendFlow Team.",
            studentName, roll, branch, status.toUpperCase()
        );

        sendSms(phone, studentName, message);
    }
}
