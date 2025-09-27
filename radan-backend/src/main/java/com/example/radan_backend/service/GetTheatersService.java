package com.example.radan_backend.service;

import com.example.radan_backend.Query;
import com.example.radan_backend.dto.TheaterDTO;
import com.example.radan_backend.entity.Theater;
import com.example.radan_backend.repository.TheaterRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetTheatersService implements Query<Void, List<TheaterDTO>> {
    private final TheaterRepository theaterRepository;

    public GetTheatersService(TheaterRepository theaterRepository) {
        this.theaterRepository = theaterRepository;
    }


    @Override
    public ResponseEntity<List<TheaterDTO>> execute(Void input) {
        List<Theater> theaters = theaterRepository.findAll();
        List<TheaterDTO> theaterDTOs = theaters.stream().map(TheaterDTO::new).toList();
        return ResponseEntity.status(HttpStatus.OK).body(theaterDTOs);
    }
}
