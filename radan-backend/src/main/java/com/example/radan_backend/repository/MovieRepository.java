package com.example.radan_backend.repository;

import com.example.radan_backend.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Integer> {
//    List<Product> findByNameContaining(String name);
//
//    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
//    List<Product> findByNameOrDescriptionContaining(@Param("keyword") String name);
    @Query("SELECT DISTINCT mts.movie FROM MovieTheaterSchedule mts WHERE CURRENT_DATE BETWEEN mts.releaseDate AND mts.endDate")
    List<Movie> findMoviesPlayingRightNow();

    @Query("SELECT m FROM Movie m WHERE NOT EXISTS (" +
            "SELECT 1 FROM MovieTheaterSchedule mts " +
            "WHERE mts.movie = m AND mts.theater.id = :theaterId)")
    List<Movie> findAllMoviesWithoutScheduleForTheater(@Param("theaterId") Integer theaterId);

//    @Query("SELECT DISTINCT m FROM Movie m JOIN m.movieTheaterSchedules mts " +
//            "WHERE mts.theater.id = :theaterId")
//    List<Movie> findAllMoviesWithScheduleForTheater(@Param("theaterId") Integer theaterId);

}
