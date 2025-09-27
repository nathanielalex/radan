package com.example.radan_backend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class BookingResponse {
    private String movieTitle;
    private String theaterName;
    private LocalDate showtimeDate;
    private LocalTime showtime;
    private Float totalPrice;
    private List<String> seatNumbers;

    public BookingResponse(String movieTitle, String theaterName, LocalDate showtimeDate, LocalTime showtime, Float totalPrice, List<String> seatNumbers) {
        this.movieTitle = movieTitle;
        this.theaterName = theaterName;
        this.showtimeDate = showtimeDate;
        this.showtime = showtime;
        this.totalPrice = totalPrice;
        this.seatNumbers = seatNumbers;
    }
}
