package com.example.radan_backend.controller;

import com.example.radan_backend.dto.BookingRequest;
import com.example.radan_backend.dto.BookingResponse;
import com.example.radan_backend.dto.MovieDetailDTO;
import com.example.radan_backend.service.CreateBookingsService;
import com.example.radan_backend.service.GetBookingsByUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final CreateBookingsService createBookingsService;
    private final GetBookingsByUserService getBookingsByUserService;

    public BookingController(CreateBookingsService createBookingsService, GetBookingsByUserService getBookingsByUserService) {
        this.createBookingsService = createBookingsService;
        this.getBookingsByUserService = getBookingsByUserService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request){
        return createBookingsService.execute(request);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<BookingResponse>> getBookingsByUser(@PathVariable Integer id){
        return getBookingsByUserService.execute(id);
    }
}
