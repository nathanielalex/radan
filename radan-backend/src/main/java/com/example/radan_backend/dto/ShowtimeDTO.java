package com.example.radan_backend.dto;

import lombok.Data;

import java.time.LocalTime;

@Data
public class ShowtimeDTO {
    private Integer id;
    private LocalTime startTime;
}
