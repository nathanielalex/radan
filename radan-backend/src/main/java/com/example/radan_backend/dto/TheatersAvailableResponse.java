package com.example.radan_backend.dto;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class TheatersAvailableResponse {
    private Integer id;
    private String name;
    private String location;
    private List<ShowtimeOverviewDTO> showtimeOverviewDTOs;
}
