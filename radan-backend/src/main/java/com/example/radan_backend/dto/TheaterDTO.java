package com.example.radan_backend.dto;

import com.example.radan_backend.entity.Theater;
import lombok.Data;

@Data
public class TheaterDTO {
    private Integer id;
    private String name;
    private String location;

    public TheaterDTO(Theater theater) {
        this.id = theater.getId();
        this.name = theater.getName();
        this.location = theater.getLocation();
    }

}
