package com.example.radan_backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class ShowtimeOverviewDTO {
    private String studioType;
    private List<ShowtimeDTO> showtimeDTOs;
    private Float price;
}
