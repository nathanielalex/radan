package com.example.radan_backend.dto;

import com.example.radan_backend.entity.Cast;
import com.example.radan_backend.entity.Genre;
import com.example.radan_backend.entity.Movie;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
public class MovieDetailDTO {
    private Integer id;
    private String title;
    private Integer duration;
    private String synopsis;
    private String director;
    private String posterUrl;
    private List<Genre> genres;
    private List<Cast> casts;

    public MovieDetailDTO(Movie movie) {
        this.id = movie.getId();
        this.title = movie.getTitle();
        this.duration = movie.getDuration();
        this.synopsis = movie.getSynopsis();
        this.director = movie.getDirector();
        this.posterUrl = movie.getPosterUrl();
        this.genres = movie.getGenres();
        this.casts = movie.getCasts();
    }

}
