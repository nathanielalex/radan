package com.example.radan_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TheatersAvailableRequest {
    private Integer movieId;
    private Integer cityId;
}
