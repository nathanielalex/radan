package com.example.radan_backend.service;

import com.example.radan_backend.Command;
import com.example.radan_backend.dto.MovieDTO;
import com.example.radan_backend.dto.StudioLayoutDTO;
import com.example.radan_backend.dto.StudioLayoutRequest;
import com.example.radan_backend.entity.LayoutSeat;
import com.example.radan_backend.entity.StudioLayout;
import com.example.radan_backend.repository.StudioLayoutRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CreateStudioLayoutService implements Command<StudioLayoutRequest, StudioLayoutDTO> {

    private final StudioLayoutRepository studioLayoutRepository;

    public CreateStudioLayoutService(StudioLayoutRepository studioLayoutRepository) {
        this.studioLayoutRepository = studioLayoutRepository;
    }

    @Override
    public ResponseEntity<StudioLayoutDTO> execute(StudioLayoutRequest request) {
        StudioLayout studioLayout = new StudioLayout();
        studioLayout.setName(request.getName());

        // Convert LayoutSeatRequest to LayoutSeat
        List<LayoutSeat> layoutSeats = request.getLayoutSeats().stream().map(seatRequest -> {
            LayoutSeat seat = new LayoutSeat();
            seat.setRowNumber(seatRequest.getRowNumber());
            seat.setColumnNumber(seatRequest.getColumnNumber());
            seat.setSeatNumber(seatRequest.getSeatNumber());
            seat.setStudioLayout(studioLayout);
            return seat;
        }).collect(Collectors.toList());

        // Set the layout seats to the layout
        studioLayout.setLayoutSeats(layoutSeats);

        // Save with cascade
        StudioLayout savedLayout = studioLayoutRepository.save(studioLayout);

        return ResponseEntity.status(HttpStatus.CREATED).body(new StudioLayoutDTO(savedLayout));
    }
}
