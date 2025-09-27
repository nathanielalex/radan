package com.example.radan_backend.dto;

import com.example.radan_backend.entity.StudioLayout;
import lombok.Data;

@Data
public class StudioLayoutDTO {
    private Integer id;
    private String name;

    public StudioLayoutDTO(StudioLayout studioLayout) {
        this.id = studioLayout.getId();
        this.name = studioLayout.getName();
    }
}
