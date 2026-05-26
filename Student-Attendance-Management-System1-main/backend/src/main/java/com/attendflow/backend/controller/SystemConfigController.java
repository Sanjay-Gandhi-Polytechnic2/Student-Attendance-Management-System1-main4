package com.attendflow.backend.controller;

import com.attendflow.backend.model.SystemConfig;
import com.attendflow.backend.repository.SystemConfigRepository;
import com.attendflow.backend.service.AttendanceAutomationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/config")
@CrossOrigin(origins = "*")
public class SystemConfigController {

    @Autowired
    private SystemConfigRepository systemConfigRepository;

    @Autowired
    private AttendanceAutomationService automationService;

    @GetMapping
    public ResponseEntity<SystemConfig> getConfig() {
        return systemConfigRepository.findById(1L)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<SystemConfig> updateConfig(@RequestBody SystemConfig newConfig) {
        return systemConfigRepository.findById(1L)
                .map(config -> {
                    config.setAutoAbsentActive(newConfig.isAutoAbsentActive());
                    config.setAutoAbsentTime(newConfig.getAutoAbsentTime());
                    config.setAutoNotifyActive(newConfig.isAutoNotifyActive());
                    config.setSmsNotifyActive(newConfig.isSmsNotifyActive());
                    config.setAutoResetTime(newConfig.getAutoResetTime());
                    return ResponseEntity.ok(systemConfigRepository.save(config));
                })
                .orElseGet(() -> {
                    newConfig.setId(1L);
                    return ResponseEntity.ok(systemConfigRepository.save(newConfig));
                });
    }

    @PostMapping("/simulate-sweep")
    public ResponseEntity<?> simulateSweep() {
        try {
            int sweptCount = automationService.executeDailySweep(true);
            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "message", "Simulated daily sweep executed successfully.",
                    "sweptCount", sweptCount
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "ERROR",
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/simulate-reset")
    public ResponseEntity<?> simulateReset() {
        try {
            int resetCount = automationService.executeDailyReset();
            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "message", "Simulated midnight reset executed successfully.",
                    "resetCount", resetCount
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "ERROR",
                    "message", e.getMessage()
            ));
        }
    }
}
