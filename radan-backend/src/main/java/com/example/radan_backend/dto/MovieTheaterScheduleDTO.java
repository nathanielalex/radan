package com.example.radan_backend.dto;

import com.example.radan_backend.entity.MovieTheaterSchedule;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MovieTheaterScheduleDTO {
    private Integer movieId;
    private String movieTitle;
    private Integer theaterId;
    private LocalDate releaseDate;
    private LocalDate endDate;

    public MovieTheaterScheduleDTO(MovieTheaterSchedule movieTheaterSchedule, String movieTitle) {
        this.movieTitle = movieTitle;
        this.movieId = movieTheaterSchedule.getMovie().getId();
        this.theaterId = movieTheaterSchedule.getTheater().getId();
        this.releaseDate = movieTheaterSchedule.getReleaseDate();
        this.endDate = movieTheaterSchedule.getEndDate();
    }

}
