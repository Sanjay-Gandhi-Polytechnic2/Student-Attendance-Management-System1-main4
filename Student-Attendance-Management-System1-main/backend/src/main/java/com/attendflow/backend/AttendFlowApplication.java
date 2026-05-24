package com.attendflow.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AttendFlowApplication {
	public static void main(String[] args) {
		SpringApplication.run(AttendFlowApplication.class, args);
	}
}