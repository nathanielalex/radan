package com.example.radan_backend.controller;

import com.example.radan_backend.dto.CastDTO;
import com.example.radan_backend.dto.CityDTO;
import com.example.radan_backend.entity.Cast;
import com.example.radan_backend.entity.Genre;
import com.example.radan_backend.repository.CastRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/casts")
public class CastController {

    private final CastRepository castRepository;

    public CastController(CastRepository castRepository) {
        this.castRepository = castRepository;
    }

    @GetMapping
    public ResponseEntity<List<CastDTO>> getCasts() {
        List<Cast> casts = castRepository.findAll();
        List<CastDTO> castDTOs = casts.stream().map(CastDTO::new).toList();
        return ResponseEntity.status(HttpStatus.OK).body(castDTOs);
    }

}
