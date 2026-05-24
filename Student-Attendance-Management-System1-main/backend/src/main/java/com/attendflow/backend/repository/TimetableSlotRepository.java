package com.attendflow.backend.repository;

import com.attendflow.backend.model.TimetableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableSlotRepository extends JpaRepository<TimetableSlot, Long> {
    List<TimetableSlot> findByBranchAndSemester(String branch, String semester);
    List<TimetableSlot> findByTeacherNameContainingIgnoreCase(String teacherName);
}
