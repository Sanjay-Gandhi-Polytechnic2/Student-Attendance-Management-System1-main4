package com.attendflow.backend.controller;

import com.attendflow.backend.model.SmsLog;
import com.attendflow.backend.repository.SmsLogRepository;
import com.attendflow.backend.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sms")
@CrossOrigin(origins = "*")
public class SmsController {

    @Autowired
    private SmsLogRepository smsLogRepository;

    @Autowired
    private SmsService smsService;

    @GetMapping("/logs")
    public List<SmsLog> getSmsLogs() {
        return smsLogRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/send-test")
    public ResponseEntity<?> sendTestSms(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        String studentName = request.get("studentName");
        String message = request.get("message");

        if (phone == null || phone.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Recipient number is required"));
        }
        if (studentName == null || studentName.trim().isEmpty()) {
            studentName = "Test Sandbox Mode";
        }
        if (message == null || message.trim().isEmpty()) {
            message = "AttendFlow SMS Gateway Sandbox System Test Message. SGP team.";
        }

        boolean delivered = smsService.sendSms(phone, studentName, message);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "status", delivered ? "DELIVERED" : "SIMULATED",
            "message", "SMS processed through gateway."
        ));
    }
}
