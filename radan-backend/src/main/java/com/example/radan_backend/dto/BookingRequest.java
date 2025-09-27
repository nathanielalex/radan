package com.example.radan_backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BookingRequest {
    private Integer userId;
    private List<Integer> showtimeSeatIds;
}
