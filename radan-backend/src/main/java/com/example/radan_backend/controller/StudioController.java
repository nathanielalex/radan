package com.example.radan_backend.controller;

import com.example.radan_backend.dto.StudioDTO;
import com.example.radan_backend.service.GetStudiosByTheaterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/studios")
public class StudioController {
    private final GetStudiosByTheaterService getStudiosByTheaterService;

    public StudioController(GetStudiosByTheaterService getStudiosByTheaterService) {
        this.getStudiosByTheaterService = getStudiosByTheaterService;
    }

    @GetMapping("/theater/{id}")
    public ResponseEntity<List<StudioDTO>> getStudiosByTheater(@PathVariable Integer id){
        return getStudiosByTheaterService.execute(id);
    }
}
