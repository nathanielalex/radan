package com.example.radan_backend.service;

import com.example.radan_backend.Query;
import com.example.radan_backend.dto.BookingDetailDTO;
import com.example.radan_backend.dto.BookingResponse;
import com.example.radan_backend.repository.BookingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class GetBookingsByUserService implements Query<Integer, List<BookingResponse>> {

    private final BookingRepository bookingRepository;

    public GetBookingsByUserService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    public ResponseEntity<List<BookingResponse>> execute(Integer id) {
        // 1. Fetch all booked seats for the user
        List<BookingDetailDTO> details = bookingRepository.findBookingDetailsByUserId(id);

        // Use a LinkedHashMap to maintain insertion order and group by showtimeId
        Map<Integer, BookingResponse> groupedBookings = new LinkedHashMap<>();

        for (BookingDetailDTO detail : details) {
            BookingResponse bookingResponse = groupedBookings.get(detail.showtimeId());

            float seatPrice = detail.price() != null ? detail.price() : 0.0f;

            if (bookingResponse == null) {
                List<String> seatNumbers = new ArrayList<>();
                seatNumbers.add(detail.seatNumber());

                // Use real showtime date if available in DTO (replace LocalDate.now() if so)
                bookingResponse = new BookingResponse(
                        detail.movieTitle(),
                        detail.theaterName(),
                        detail.bookingTimestamp().toLocalDate(),
                        detail.showtime(),
                        seatPrice,
                        seatNumbers
                );
                groupedBookings.put(detail.showtimeId(), bookingResponse);
            } else {
                bookingResponse.getSeatNumbers().add(detail.seatNumber());
                bookingResponse.setTotalPrice(bookingResponse.getTotalPrice() + seatPrice);
            }
        }

        // Return grouped booking responses as list
        List<BookingResponse> bookings = new ArrayList<>(groupedBookings.values());
        return ResponseEntity.status(HttpStatus.OK).body(bookings);
    }
}
