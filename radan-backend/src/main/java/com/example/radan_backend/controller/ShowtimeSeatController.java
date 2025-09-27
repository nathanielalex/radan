package com.example.radan_backend.controller;

import com.example.radan_backend.dto.ShowtimeSeatDTO;
import com.example.radan_backend.service.GetAvailableSeatsService;
import com.example.radan_backend.service.GetShowtimeSeatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/showtime-seats")
public class ShowtimeSeatController {
    private final GetAvailableSeatsService getAvailableSeatsService;
    private final GetShowtimeSeatsService getShowtimeSeatsService;

    public ShowtimeSeatController(GetAvailableSeatsService getAvailableSeatsService, GetShowtimeSeatsService getShowtimeSeatsService) {
        this.getAvailableSeatsService = getAvailableSeatsService;
        this.getShowtimeSeatsService = getShowtimeSeatsService;
    }

    @GetMapping("/available/{id}")
    public ResponseEntity<Long> getAvailableSeats(@PathVariable Integer id){
        return getAvailableSeatsService.execute(id);
    }

    @GetMapping("/showtime/{id}")
    public ResponseEntity<List<ShowtimeSeatDTO>> getShowtimeSeatsByShowtime(@PathVariable Integer id){
        return getShowtimeSeatsService.execute(id);
    }

}
