package com.example.radan_backend.controller;

import com.example.radan_backend.dto.StudioTypeDTO;
import com.example.radan_backend.entity.StudioType;
import com.example.radan_backend.repository.StudioTypeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/studio-types")
public class StudioTypeController {
    private final StudioTypeRepository studioTypeRepository;

    public StudioTypeController(StudioTypeRepository studioTypeRepository) {
        this.studioTypeRepository = studioTypeRepository;
    }

    @GetMapping
    public ResponseEntity<List<StudioTypeDTO>> getStudioTypes() {
        List<StudioType> types = studioTypeRepository.findAll();
        List<StudioTypeDTO> typeDTOs = types.stream().map(StudioTypeDTO::new).toList();
        return ResponseEntity.status(HttpStatus.OK).body(typeDTOs);
    }
}
