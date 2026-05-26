package com.attendflow.backend.controller;

import com.attendflow.backend.model.Student;
import com.attendflow.backend.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private com.attendflow.backend.service.SmsService smsService;

    @Autowired
    private com.attendflow.backend.repository.SystemConfigRepository systemConfigRepository;

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/search")
    public List<Student> searchStudents(@RequestParam String query) {
        return studentRepository.findByNameContainingIgnoreCaseOrRollContainingIgnoreCase(query, query);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Student> updateStatus(@PathVariable @io.micrometer.common.lang.NonNull Long id,
            @RequestBody Student statusUpdate) {
        return studentRepository.findById(id)
                .map(student -> {
                    String newStatus = statusUpdate.getStatus();
                    if ("Present".equalsIgnoreCase(newStatus)) {
                        student.setPresentCount(student.getPresentCount() + 1);
                    } else if ("Absent".equalsIgnoreCase(newStatus)) {
                        student.setAbsentCount(student.getAbsentCount() + 1);
                        try {
                            systemConfigRepository.findById(1L).ifPresent(config -> {
                                if (config.isSmsNotifyActive()) {
                                    smsService.sendAttendanceAlert(student, "Absent");
                                }
                            });
                        } catch (Exception ex) {
                            System.err.println("[STUDENT CONTROLLER] Failed to send automated SMS: " + ex.getMessage());
                        }
                    }
                    
                    student.setStatus(newStatus);
                    student.setTime(statusUpdate.getTime());
                    student.setBranch(statusUpdate.getBranch());
                    student.setSemester(statusUpdate.getSemester());
                    student.setSubject(statusUpdate.getSubject());
                    return ResponseEntity.ok(studentRepository.save(student));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable @io.micrometer.common.lang.NonNull Long id,
            @RequestBody Student studentDetails) {
        return studentRepository.findById(id)
                .map(student -> {
                    student.setName(studentDetails.getName());
                    String oldPhone = student.getParentPhoneNumber();
                    String newPhone = studentDetails.getParentPhoneNumber();

                    student.setRoll(studentDetails.getRoll());
                    student.setStudentClass(studentDetails.getStudentClass());
                    student.setBranch(studentDetails.getBranch());
                    student.setSemester(studentDetails.getSemester());
                    student.setSubject(studentDetails.getSubject());
                    student.setParentPhoneNumber(newPhone);

                    if (studentDetails.getStatus() != null)
                        student.setStatus(studentDetails.getStatus());
                    if (studentDetails.getTime() != null)
                        student.setTime(studentDetails.getTime());

                    Student updated = studentRepository.save(student);

                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public @io.micrometer.common.lang.NonNull Student addStudent(
            @RequestBody @io.micrometer.common.lang.NonNull Student student) {
        return studentRepository.save(student);
    }
}
