package com.example.radan_backend.service;

import com.example.radan_backend.Query;
import com.example.radan_backend.dto.MovieDetailDTO;
import com.example.radan_backend.entity.Movie;
import com.example.radan_backend.repository.MovieRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GetMovieService implements Query<Integer, MovieDetailDTO> {

    private final MovieRepository movieRepository;

    public GetMovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }


    @Override
    public ResponseEntity<MovieDetailDTO> execute(Integer id) {
        Optional<Movie> movieOptional = movieRepository.findById(id);
        if(movieOptional.isPresent()) {
            return ResponseEntity.ok(new MovieDetailDTO(movieOptional.get()));
        }
        //throw exception
        return null;
    }
}
