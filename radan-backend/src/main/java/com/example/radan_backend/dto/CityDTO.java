package com.example.radan_backend.dto;

import com.example.radan_backend.entity.City;
import lombok.Data;

@Data
public class CityDTO {
    private Integer id;
    private String name;

    public CityDTO(City city) {
        this.id = city.getId();
        this.name = city.getName();
    }

}
