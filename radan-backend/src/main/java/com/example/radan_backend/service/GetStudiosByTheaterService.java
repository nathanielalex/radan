package com.example.radan_backend.service;

import com.example.radan_backend.Query;
import com.example.radan_backend.dto.StudioDTO;
import com.example.radan_backend.entity.Studio;
import com.example.radan_backend.repository.StudioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetStudiosByTheaterService implements Query<Integer, List<StudioDTO>> {
    private final StudioRepository studioRepository;

    public GetStudiosByTheaterService(StudioRepository studioRepository) {
        this.studioRepository = studioRepository;
    }

    @Override
    public ResponseEntity<List<StudioDTO>> execute(Integer id) {
        List<Studio> studios = studioRepository.findByTheaterId(id);
        List<StudioDTO> studioDTOs = studios.stream().map(StudioDTO::new).toList();
        return ResponseEntity.status(HttpStatus.OK).body(studioDTOs);
    }
}
