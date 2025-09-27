package com.example.radan_backend.service;

import com.example.radan_backend.Query;
import com.example.radan_backend.dto.MovieDTO;
import com.example.radan_backend.entity.Movie;
import com.example.radan_backend.repository.MovieRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetMoviesService implements Query<Void, List<MovieDTO>> {

    private final MovieRepository movieRepository;

    public GetMoviesService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public ResponseEntity<List<MovieDTO>> execute(Void input) {
        List<Movie> movies = movieRepository.findAll();
        List<MovieDTO> movieDTOs = movies.stream().map(MovieDTO::new).toList();
        return ResponseEntity.status(HttpStatus.OK).body(movieDTOs);
    }
}
