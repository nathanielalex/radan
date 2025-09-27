package com.example.radan_backend.repository;

import com.example.radan_backend.entity.Studio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudioRepository extends JpaRepository<Studio, Integer> {
    @Query("""
        SELECT DISTINCT s
        FROM Studio s
        JOIN s.showtimes st
        WHERE s.theater.id = :theaterId
          AND st.movie.id = :movieId
    """)
    List<Studio> findStudiosByTheaterIdAndMovieId(
            @Param("theaterId") Integer theaterId,
            @Param("movieId") Integer movieId
    );

    List<Studio> findByTheaterId(Integer theaterId);
    List<Studio> findAllByTheater_IdAndStudioType_Id(Integer theaterId, Integer studioTypeId);
}
