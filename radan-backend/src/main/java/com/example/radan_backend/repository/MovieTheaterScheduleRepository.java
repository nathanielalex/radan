package com.example.radan_backend.repository;

import com.example.radan_backend.entity.MovieTheaterSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieTheaterScheduleRepository extends JpaRepository<MovieTheaterSchedule, Integer> {
    List<MovieTheaterSchedule> findByTheater_Id(Integer theaterId);
    void deleteByMovieId(Integer movieId);
}
