package com.example.radan_backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class MovieTheaterScheduleRequest {
    private Integer movieId;
    private Integer theaterId;
    private LocalDate releaseDate;
    private LocalDate endDate;
    private List<ShowtimeRequest> showtimes;
}
