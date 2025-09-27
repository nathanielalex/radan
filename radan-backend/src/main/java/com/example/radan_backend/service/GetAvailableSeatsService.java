package com.example.radan_backend.service;

import com.example.radan_backend.Query;
import com.example.radan_backend.repository.ShowtimeSeatRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class GetAvailableSeatsService implements Query<Integer, Long> {
    private final ShowtimeSeatRepository showtimeSeatRepository;

    public GetAvailableSeatsService(ShowtimeSeatRepository showtimeSeatRepository) {
        this.showtimeSeatRepository = showtimeSeatRepository;
    }

    @Override
    public ResponseEntity<Long> execute(Integer id) {
        return ResponseEntity.ok(showtimeSeatRepository.countByShowtimeIdAndIsBookedFalse(id));
    }
}
