package com.example.radan_backend.service;

import com.example.radan_backend.Command;
import com.example.radan_backend.dto.BookingRequest;
import com.example.radan_backend.dto.BookingResponse;
import com.example.radan_backend.entity.*;
import com.example.radan_backend.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class CreateBookingsService implements Command<BookingRequest, BookingResponse> {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ShowtimeSeatRepository showtimeSeatRepository;
    private final PriceRepository priceRepository;

    public CreateBookingsService(BookingRepository bookingRepository, UserRepository userRepository, ShowtimeSeatRepository showtimeSeatRepository, PriceRepository priceRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.showtimeSeatRepository = showtimeSeatRepository;
        this.priceRepository = priceRepository;
    }

    @Override
    public ResponseEntity<BookingResponse> execute(BookingRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> seatNumbers = new java.util.ArrayList<>(List.of());

        for (Integer showtimeSeatId : request.getShowtimeSeatIds()) {
            ShowtimeSeat seat = showtimeSeatRepository.findById(showtimeSeatId)
                    .orElseThrow(() -> new RuntimeException(("Showtime seat not found")));
            seat.setIsBooked(true);
            showtimeSeatRepository.save(seat);

            Booking booking = new Booking();
            booking.setUser(user);
            booking.setShowtimeSeat(seat);
            bookingRepository.save(booking);
            seatNumbers.add(seat.getLayoutSeat().getSeatNumber());
        }

        ShowtimeSeat showTimeSeat = showtimeSeatRepository.findById(request.getShowtimeSeatIds().get(0))
                .orElseThrow(() -> new RuntimeException("Showtime seat not found"));

        LocalTime showtime = showTimeSeat.getShowtime().getStartTime();
        LocalDate showtimeDate = LocalDate.now();
        String movieTitle = showTimeSeat.getShowtime().getMovie().getTitle();
        String theaterName = showTimeSeat.getShowtime().getStudio().getTheater().getName();
        Price price = priceRepository.findByTheaterAndStudioType(
                showTimeSeat.getShowtime().getStudio().getTheater(),
                showTimeSeat.getShowtime().getStudio().getStudioType()
        ).orElseThrow(() -> new RuntimeException("Showtime seat not found"));

        Float totalPrice;
        DayOfWeek dayOfWeek = showtimeDate.getDayOfWeek();
        if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
            totalPrice = price.getHolidayPrice() * request.getShowtimeSeatIds().size();
        } else {
            totalPrice = price.getPrice() * request.getShowtimeSeatIds().size();
        }

        BookingResponse response = new BookingResponse(movieTitle, theaterName, showtimeDate, showtime, totalPrice, seatNumbers);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }
}
