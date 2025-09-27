package com.example.radan_backend.controller;

import com.example.radan_backend.dto.MovieDTO;
import com.example.radan_backend.dto.MovieDetailDTO;
import com.example.radan_backend.dto.MovieRequest;
import com.example.radan_backend.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    private final CreateMovieService createMovieService;
    private final GetMoviesService getMoviesService;
    private final GetMoviesPlayingService getMoviesPlayingService;
    private final GetMovieService getMovieService;
    private final GetMoviesWithoutScheduleForTheaterService getMoviesWithoutScheduleForTheaterService;
    private final DeleteMovieService deleteMovieService;

    public MovieController(CreateMovieService createMovieService, GetMoviesService getMoviesService, GetMoviesPlayingService getMoviesPlayingService, GetMovieService getMovieService, GetMoviesWithoutScheduleForTheaterService getMoviesWithoutScheduleForTheaterService, DeleteMovieService deleteMovieService) {
        this.createMovieService = createMovieService;
        this.getMoviesService = getMoviesService;
        this.getMoviesPlayingService = getMoviesPlayingService;
        this.getMovieService = getMovieService;
        this.getMoviesWithoutScheduleForTheaterService = getMoviesWithoutScheduleForTheaterService;
        this.deleteMovieService = deleteMovieService;
    }

    @PostMapping
    public ResponseEntity<MovieDTO> createMovie(@ModelAttribute MovieRequest request){
        //use model attribute for file uploads
        if (request.getPosterImage() == null) {
            System.out.println("poster image is null");
        }
        return createMovieService.execute(request);
    }

    @GetMapping
    public ResponseEntity<List<MovieDTO>> getMovies(){
        return getMoviesService.execute(null);
    }

    @GetMapping("/playing")
    public ResponseEntity<List<MovieDTO>> getMoviesPlaying(){
        return getMoviesPlayingService.execute(null);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieDetailDTO> getMovieById(@PathVariable Integer id){
        return getMovieService.execute(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Integer id){
        return deleteMovieService.execute(id);
    }

    @GetMapping("/theater/{id}")
    public ResponseEntity<List<MovieDTO>> getMoviesWithoutScheduleForTheater(@PathVariable Integer id){
        return getMoviesWithoutScheduleForTheaterService.execute(id);
    }

}
