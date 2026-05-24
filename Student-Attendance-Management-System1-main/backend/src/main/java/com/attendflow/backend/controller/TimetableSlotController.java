package com.attendflow.backend.controller;

import com.attendflow.backend.model.TimetableSlot;
import com.attendflow.backend.repository.TimetableSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin(origins = "*")
public class TimetableSlotController {

    @Autowired
    private TimetableSlotRepository timetableSlotRepository;

    @GetMapping
    public List<TimetableSlot> getAllSlots(
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) String semester,
            @RequestParam(required = false) String teacherName) {
        
        if (branch != null && semester != null) {
            return timetableSlotRepository.findByBranchAndSemester(branch, semester);
        } else if (teacherName != null) {
            return timetableSlotRepository.findByTeacherNameContainingIgnoreCase(teacherName);
        }
        return timetableSlotRepository.findAll();
    }

    @PostMapping
    public TimetableSlot createSlot(@RequestBody TimetableSlot slot) {
        return timetableSlotRepository.save(slot);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimetableSlot> updateSlot(@PathVariable Long id, @RequestBody TimetableSlot slotDetails) {
        return timetableSlotRepository.findById(id)
                .map(slot -> {
                    slot.setDayOfWeek(slotDetails.getDayOfWeek());
                    slot.setTimeSlot(slotDetails.getTimeSlot());
                    slot.setSubject(slotDetails.getSubject());
                    slot.setRoom(slotDetails.getRoom());
                    slot.setTeacherName(slotDetails.getTeacherName());
                    slot.setBranch(slotDetails.getBranch());
                    slot.setSemester(slotDetails.getSemester());
                    slot.setColor(slotDetails.getColor());
                    return ResponseEntity.ok(timetableSlotRepository.save(slot));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long id) {
        return timetableSlotRepository.findById(id)
                .map(slot -> {
                    timetableSlotRepository.delete(slot);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
