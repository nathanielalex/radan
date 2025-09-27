package com.example.radan_backend.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;

public record BookingDetailDTO(
        Integer showtimeId,
        String movieTitle,
        String theaterName,
        LocalTime showtime,
        Float price,
        String seatNumber,
        LocalDateTime bookingTimestamp
) {}
