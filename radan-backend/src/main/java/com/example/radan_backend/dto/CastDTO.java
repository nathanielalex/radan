package com.example.radan_backend.dto;

import com.example.radan_backend.entity.Cast;
import com.example.radan_backend.entity.City;
import lombok.Data;

@Data
public class CastDTO {
    private Integer id;
    private String name;

    public CastDTO(Cast cast) {
        this.id = cast.getId();
        this.name = cast.getName();
    }
}
