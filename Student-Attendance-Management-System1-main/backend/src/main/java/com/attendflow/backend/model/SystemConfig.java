package com.attendflow.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "system_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemConfig {
    @Id
    private Long id;
    
    private boolean autoAbsentActive;
    private String autoAbsentTime; // e.g., "17:00"
    private boolean autoNotifyActive;
    private boolean smsNotifyActive;
    private String autoResetTime; // e.g., "00:00"
}
