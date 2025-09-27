package com.example.radan_backend.dto;

import lombok.Data;

@Data
public class ShowtimeSeatDTO {
    private Integer id;
    private String seatNumber;
    private Integer rowNumber;
    private Integer columnNumber;
    private Boolean isBooked;
}
