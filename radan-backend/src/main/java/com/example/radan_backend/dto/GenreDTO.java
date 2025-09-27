package com.example.radan_backend.dto;

import com.example.radan_backend.entity.Genre;
import lombok.Data;

@Data
public class GenreDTO {
    private Integer id;
    private String name;

    public GenreDTO(Genre genre) {
        this.id = genre.getId();
        this.name = genre.getName();
    }
}
