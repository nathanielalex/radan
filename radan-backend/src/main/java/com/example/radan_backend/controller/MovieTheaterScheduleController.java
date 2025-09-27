package com.example.radan_backend.controller;

import com.example.radan_backend.dto.*;
import com.example.radan_backend.service.CreateMovieTheaterScheduleService;
import com.example.radan_backend.service.GetSchedulesByTheaterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movie-theater-schedule")
public class MovieTheaterScheduleController {
    private final CreateMovieTheaterScheduleService createMovieTheaterScheduleService;
    private final GetSchedulesByTheaterService getSchedulesByTheaterService;

    public MovieTheaterScheduleController(CreateMovieTheaterScheduleService createMovieTheaterScheduleService, GetSchedulesByTheaterService getSchedulesByTheaterService) {
        this.createMovieTheaterScheduleService = createMovieTheaterScheduleService;
        this.getSchedulesByTheaterService = getSchedulesByTheaterService;
    }

    @PostMapping
    public ResponseEntity<MovieTheaterScheduleDTO> createMovieTheaterSchedule(@RequestBody MovieTheaterScheduleRequest request){
        return createMovieTheaterScheduleService.execute(request);
    }

    @GetMapping("/theater/{id}")
    public ResponseEntity<List<MovieTheaterScheduleDTO>> getSchedulesByTheater(@PathVariable Integer id){
        return getSchedulesByTheaterService.execute(id);
    }
}
