package com.example.radan_backend.service;

import com.example.radan_backend.Query;
import com.example.radan_backend.dto.ShowtimeSeatDTO;
import com.example.radan_backend.entity.ShowtimeSeat;
import com.example.radan_backend.repository.ShowtimeSeatRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetShowtimeSeatsService implements Query<Integer, List<ShowtimeSeatDTO>> {
    private final ShowtimeSeatRepository showtimeSeatRepository;

    public GetShowtimeSeatsService(ShowtimeSeatRepository showtimeSeatRepository) {
        this.showtimeSeatRepository = showtimeSeatRepository;
    }


    @Override
    public ResponseEntity<List<ShowtimeSeatDTO>> execute(Integer id) {
        List<ShowtimeSeat> showtimeSeats = showtimeSeatRepository.findAllByShowtimeId(id);
        List<ShowtimeSeatDTO> showtimeSeatDTOs = showtimeSeats.stream().map(showtimeSeat -> {
            ShowtimeSeatDTO showtimeSeatDTO = new ShowtimeSeatDTO();
            showtimeSeatDTO.setSeatNumber(showtimeSeat.getLayoutSeat().getSeatNumber());
            showtimeSeatDTO.setId(showtimeSeat.getId());
            showtimeSeatDTO.setColumnNumber(showtimeSeat.getLayoutSeat().getColumnNumber());
            showtimeSeatDTO.setRowNumber(showtimeSeat.getLayoutSeat().getRowNumber());
            showtimeSeatDTO.setIsBooked(showtimeSeat.getIsBooked());
            return showtimeSeatDTO;
        }).toList();
        return ResponseEntity.status(HttpStatus.OK).body(showtimeSeatDTOs);
    }
}
