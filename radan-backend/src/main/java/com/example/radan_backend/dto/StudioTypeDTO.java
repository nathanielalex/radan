package com.example.radan_backend.dto;

import com.example.radan_backend.entity.StudioType;
import lombok.Data;

@Data
public class StudioTypeDTO {
    private Integer id;
    private String name;

    public StudioTypeDTO(StudioType studioType) {
        this.id = studioType.getId();
        this.name = studioType.getName();
    }
}
