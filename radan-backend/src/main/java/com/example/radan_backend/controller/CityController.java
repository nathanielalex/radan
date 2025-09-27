package com.example.radan_backend.controller;

import com.example.radan_backend.dto.CityDTO;
import com.example.radan_backend.dto.MovieDTO;
import com.example.radan_backend.entity.Cast;
import com.example.radan_backend.entity.City;
import com.example.radan_backend.repository.CityRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
public class CityController {

    private final CityRepository cityRepository;

    public CityController(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @GetMapping
    public ResponseEntity<List<CityDTO>> getCities() {
        List<City> cities = cityRepository.findAll();
        List<CityDTO> cityDTOs = cities.stream().map(CityDTO::new).toList();
        return ResponseEntity.status(HttpStatus.OK).body(cityDTOs);
    }

}
