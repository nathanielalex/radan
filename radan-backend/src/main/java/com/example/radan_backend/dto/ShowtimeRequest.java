package com.example.radan_backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class ShowtimeRequest {
    private Integer studioId;
    private LocalTime startTime;
}
