package com.example.radan_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LayoutSeatRequest {
    private Integer rowNumber;
    private Integer columnNumber;
    private String seatNumber;
}
