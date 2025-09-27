package com.example.radan_backend.controller;

import com.example.radan_backend.dto.*;
import com.example.radan_backend.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theaters")
public class TheaterController {
    private final CreateTheaterService createTheaterService;
    private final GetTheatersAvailableService getTheatersAvailableService;
    private final GetTheatersService getTheatersService;
    private final GetTheaterDetailService getTheaterDetailService;
    private final GetTheatersByCityService getTheatersByCityService;

    public TheaterController(CreateTheaterService createTheaterService, GetTheatersAvailableService getTheatersAvailableService, GetTheatersService getTheatersService, GetTheaterDetailService getTheaterDetailService, GetTheatersByCityService getTheatersByCityService) {
        this.createTheaterService = createTheaterService;
        this.getTheatersAvailableService = getTheatersAvailableService;
        this.getTheatersService = getTheatersService;
        this.getTheaterDetailService = getTheaterDetailService;
        this.getTheatersByCityService = getTheatersByCityService;
    }

    @PostMapping
    public ResponseEntity<TheaterDTO> createTheater(@RequestBody TheaterRequest request) {
        return createTheaterService.execute(request);
    }

    @GetMapping("/available")
    public ResponseEntity<List<TheatersAvailableResponse>> getAvailableTheaters(
            @RequestParam Integer movieId,
            @RequestParam Integer cityId
    ) {
        TheatersAvailableRequest request = new TheatersAvailableRequest();
        request.setMovieId(movieId);
        request.setCityId(cityId);

        return getTheatersAvailableService.execute(request);
    }

    @GetMapping
    public ResponseEntity<List<TheaterDTO>> getTheaters(){
        return getTheatersService.execute(null);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TheaterDetailDTO> getTheaterById(@PathVariable Integer id){
        return getTheaterDetailService.execute(id);
    }

    @GetMapping("/city/{id}")
    public ResponseEntity<List<TheaterDetailDTO>> getTheatersByCity(@PathVariable Integer id){
        return getTheatersByCityService.execute(id);
    }
}
