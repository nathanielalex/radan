package com.example.radan_backend.repository;

import com.example.radan_backend.entity.ShowtimeSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShowtimeSeatRepository extends JpaRepository<ShowtimeSeat, Integer> {
    List<ShowtimeSeat> findAllByShowtimeId(Integer showtimeId);
    Long countByShowtimeIdAndIsBookedFalse(Integer showtimeId);

}
