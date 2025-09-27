package com.example.radan_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudioRequest {
    private String name;
    private Integer studioTypeId;
    private Integer studioLayoutId;
}
