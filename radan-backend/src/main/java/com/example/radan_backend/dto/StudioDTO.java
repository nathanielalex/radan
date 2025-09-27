package com.example.radan_backend.dto;

import com.example.radan_backend.entity.Studio;
import lombok.Data;

@Data
public class StudioDTO {
    private Integer id;
    private String name;

    public StudioDTO(Studio studio) {
        this.id = studio.getId();
        this.name = studio.getName();
    }
}
