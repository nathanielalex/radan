package com.example.radan_backend.controller;

import com.example.radan_backend.dto.StudioLayoutDTO;
import com.example.radan_backend.dto.StudioLayoutRequest;
import com.example.radan_backend.entity.StudioLayout;
import com.example.radan_backend.repository.StudioLayoutRepository;
import com.example.radan_backend.service.CreateStudioLayoutService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/studio-layouts")
public class StudioLayoutController {
    private final CreateStudioLayoutService createStudioLayoutService;
    private final StudioLayoutRepository studioLayoutRepository;

    public StudioLayoutController(CreateStudioLayoutService createStudioLayoutService, StudioLayoutRepository studioLayoutRepository) {
        this.createStudioLayoutService = createStudioLayoutService;
        this.studioLayoutRepository = studioLayoutRepository;
    }

    @PostMapping
    public ResponseEntity<StudioLayoutDTO> createStudioLayout(@RequestBody StudioLayoutRequest request) {
        return createStudioLayoutService.execute(request);
    }

    @GetMapping
    public ResponseEntity<List<StudioLayoutDTO>> getStudioLayouts() {
        List<StudioLayout> layouts = studioLayoutRepository.findAll();
        List<StudioLayoutDTO> layoutDTOs = layouts.stream().map(StudioLayoutDTO::new).toList();
        return ResponseEntity.status(HttpStatus.OK).body(layoutDTOs);
    }
}
