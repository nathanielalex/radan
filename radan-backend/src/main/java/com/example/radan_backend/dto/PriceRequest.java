package com.example.radan_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PriceRequest {
    private Integer studioTypeId;
    private float price;
    private float holidayPrice;
}
