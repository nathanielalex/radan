package com.example.radan_backend.service;

import com.example.radan_backend.Command;
import com.example.radan_backend.entity.Movie;
import com.example.radan_backend.repository.MovieRepository;
import com.example.radan_backend.repository.MovieTheaterScheduleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class DeleteMovieService implements Command<Integer, Void> {
    private final MovieRepository movieRepository;
    private final MovieTheaterScheduleRepository movieTheaterScheduleRepository;

    public DeleteMovieService(MovieRepository movieRepository, MovieTheaterScheduleRepository movieTheaterScheduleRepository) {
        this.movieRepository = movieRepository;
        this.movieTheaterScheduleRepository = movieTheaterScheduleRepository;
    }

    @Override
    @Transactional
    public ResponseEntity<Void> execute(Integer id) {
        Optional<Movie> movieOptional = movieRepository.findById(id);
        if(movieOptional.isPresent()){
            movieTheaterScheduleRepository.deleteByMovieId(id);
            movieRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        //throw
        return null;
    }
}
