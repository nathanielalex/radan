package com.example.radan_backend.repository;

import com.example.radan_backend.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Integer> {
    List<Showtime> findByMovieId(Integer movieId);

    List<Showtime> findByStudioIdAndMovieId(Integer studioId, Integer movieId);
}
