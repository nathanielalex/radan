package com.example.radan_backend.repository;

import com.example.radan_backend.entity.Theater;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TheaterRepository extends JpaRepository<Theater, Integer> {
    @Query("""
        SELECT DISTINCT mts.theater
        FROM MovieTheaterSchedule mts
        WHERE mts.movie.id = :movieId
          AND mts.theater.city.id = :cityId
          AND CURRENT_DATE BETWEEN mts.releaseDate AND mts.endDate
    """)
    List<Theater> findTheatersByMovieAndCityAndDate(
            @Param("movieId") Integer movieId,
            @Param("cityId") Integer cityId
    );

    List<Theater> findByCityId(Integer cityId);
}
