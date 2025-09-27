package com.example.radan_backend.service;

import com.example.radan_backend.Command;
import com.example.radan_backend.dto.StudioLayoutDTO;
import com.example.radan_backend.dto.TheaterDTO;
import com.example.radan_backend.dto.TheaterRequest;
import com.example.radan_backend.entity.Price;
import com.example.radan_backend.entity.Studio;
import com.example.radan_backend.entity.Theater;
import com.example.radan_backend.repository.CityRepository;
import com.example.radan_backend.repository.StudioLayoutRepository;
import com.example.radan_backend.repository.StudioTypeRepository;
import com.example.radan_backend.repository.TheaterRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CreateTheaterService implements Command<TheaterRequest, TheaterDTO> {

    private final TheaterRepository theaterRepository;
    private final StudioTypeRepository studioTypeRepository;
    private final CityRepository cityRepository;
    private final StudioLayoutRepository studioLayoutRepository;

    public CreateTheaterService(TheaterRepository theaterRepository, StudioTypeRepository studioTypeRepository, CityRepository cityRepository, StudioLayoutRepository studioLayoutRepository) {
        this.theaterRepository = theaterRepository;
        this.studioTypeRepository = studioTypeRepository;
        this.cityRepository = cityRepository;
        this.studioLayoutRepository = studioLayoutRepository;
    }

    @Override
    public ResponseEntity<TheaterDTO> execute(TheaterRequest request) {
        Theater theater = new Theater();
        theater.setName(request.getName());
        theater.setLocation(request.getLocation());
        theater.setCity(cityRepository.findById(request.getCityId())
                .orElseThrow(() -> new RuntimeException("City not found")));

        List<Studio> studios = request.getStudios().stream().map(studioRequest -> {
            Studio studio = new Studio();
            studio.setName(studioRequest.getName());
            studio.setStudioType(studioTypeRepository.findById(studioRequest.getStudioTypeId())
                    .orElseThrow(() -> new RuntimeException("StudioType not found")));
            studio.setStudioLayout(studioLayoutRepository.findById(studioRequest.getStudioLayoutId())
                    .orElseThrow(() -> new RuntimeException("StudioLayout not found")));
            studio.setTheater(theater);
            return studio;
        }).toList();

        theater.setStudios(studios);

        List<Price> prices = request.getPrices().stream().map(priceRequest -> {
            Price price = new Price();
            price.setPrice(priceRequest.getPrice());
            price.setHolidayPrice(priceRequest.getHolidayPrice());
            price.setStudioType(studioTypeRepository.findById(priceRequest.getStudioTypeId()).orElseThrow(() ->
                    new RuntimeException("StudioType not found")));
            price.setTheater(theater);
            return price;
        }).toList();

        theater.setPrices(prices);

        // Save the theater, which should cascade to studios and prices if configured
        Theater savedTheater = theaterRepository.save(theater);

        return ResponseEntity.status(HttpStatus.CREATED).body(new TheaterDTO(savedTheater));

    }
}
