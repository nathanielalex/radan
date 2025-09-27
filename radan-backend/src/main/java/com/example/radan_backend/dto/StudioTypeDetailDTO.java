package com.example.radan_backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class StudioTypeDetailDTO {
    private String studioTypeName;
    private List<String> studioNames;
    private Float price;
    private Float holidayPrice;



}
