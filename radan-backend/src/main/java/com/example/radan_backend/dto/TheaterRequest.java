package com.example.radan_backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TheaterRequest {
    private String name;
    private String location;
    private Integer cityId;

    private List<StudioRequest> studios;
    private List<PriceRequest> prices;
}
