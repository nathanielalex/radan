package com.example.radan_backend.controller;

import com.example.radan_backend.dto.CityDTO;
import com.example.radan_backend.dto.GenreDTO;
import com.example.radan_backend.entity.Genre;
import com.example.radan_backend.repository.GenreRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
public class GenreController {

    private final GenreRepository genreRepository;

    public GenreController(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    @GetMapping
    public ResponseEntity<List<GenreDTO>> getGenres() {
        List<Genre> genres = genreRepository.findAll();
        List<GenreDTO> genreDTOs = genres.stream().map(GenreDTO::new).toList();
        return ResponseEntity.status(HttpStatus.OK).body(genreDTOs);
    }

}
