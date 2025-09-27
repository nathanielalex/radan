package com.example.radan_backend.dto;

import com.example.radan_backend.entity.Genre;
import com.example.radan_backend.entity.Movie;
import lombok.Data;

import java.util.List;

@Data
public class MovieDTO {
    private Integer id;
    private String title;
    private Integer duration;
    private String posterUrl;
    private List<Genre> genres;

    public MovieDTO(Movie movie) {
        this.id = movie.getId();
        this.title = movie.getTitle();
        this.duration = movie.getDuration();
        this.posterUrl = movie.getPosterUrl();
        this.genres = movie.getGenres();
    }
}
