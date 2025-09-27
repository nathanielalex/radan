package com.example.radan_backend.service;

import com.example.radan_backend.Query;
import com.example.radan_backend.entity.StudioLayout;
import com.example.radan_backend.repository.StudioLayoutRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GetStudioLayoutService implements Query<Integer, StudioLayout> {

    private final StudioLayoutRepository studioLayoutRepository;

    public GetStudioLayoutService(StudioLayoutRepository studioLayoutRepository) {
        this.studioLayoutRepository = studioLayoutRepository;
    }

    @Override
    public ResponseEntity<StudioLayout> execute(Integer id) {
        Optional<StudioLayout> layoutOptional = studioLayoutRepository.findById(id);
        if(layoutOptional.isPresent()){
            return ResponseEntity.ok(layoutOptional.get());
        }
        //throw exception
        return null;
    }
}
