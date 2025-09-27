package com.example.radan_backend.service;

import com.example.radan_backend.Query;
import com.example.radan_backend.dto.ShowtimeDTO;
import com.example.radan_backend.dto.ShowtimeOverviewDTO;
import com.example.radan_backend.dto.TheatersAvailableRequest;
import com.example.radan_backend.dto.TheatersAvailableResponse;
import com.example.radan_backend.entity.*;
import com.example.radan_backend.repository.PriceRepository;
import com.example.radan_backend.repository.ShowtimeRepository;
import com.example.radan_backend.repository.StudioRepository;
import com.example.radan_backend.repository.TheaterRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class GetTheatersAvailableService implements Query<TheatersAvailableRequest, List<TheatersAvailableResponse>> {
    private final TheaterRepository theaterRepository;
    private final StudioRepository studioRepository;
    private final PriceRepository priceRepository;
    private final ShowtimeRepository showtimeRepository;

    public GetTheatersAvailableService(TheaterRepository theaterRepository, StudioRepository studioRepository, PriceRepository priceRepository, ShowtimeRepository showtimeRepository) {
        this.theaterRepository = theaterRepository;
        this.studioRepository = studioRepository;
        this.priceRepository = priceRepository;
        this.showtimeRepository = showtimeRepository;
    }

    @Override
    public ResponseEntity<List<TheatersAvailableResponse>> execute(TheatersAvailableRequest request) {
        List<Theater> theaterList = theaterRepository.findTheatersByMovieAndCityAndDate(request.getMovieId(), request.getCityId());

        LocalDate showtimeDate = LocalDate.now();
        DayOfWeek dayOfWeek = showtimeDate.getDayOfWeek();

        List<TheatersAvailableResponse> responses = theaterList.stream().map(theater -> {
           TheatersAvailableResponse response = new TheatersAvailableResponse();
           response.setId(theater.getId());
           response.setName(theater.getName());
           response.setLocation(theater.getLocation());

           //skrg kita punya movie id dan theater id
            // carilah show time
            //movie id dengan movie id ini
            //studio id dengan theater id
//            System.out.printf("theater id: %d", theater.getId());
//            System.out.printf("movie id: %d", request.getMovieId());
            List<Studio> studios = studioRepository.findStudiosByTheaterIdAndMovieId(theater.getId(), request.getMovieId());
//            System.out.println("  -> Found " + studios.size() + " studios for this theater and movie.");
            List<ShowtimeOverviewDTO> overviews = studios.stream().map(studio -> {
                System.out.println("    -> Processing Studio ID: " + studio.getId() + " (" + studio.getStudioType().getName() + ")");
                ShowtimeOverviewDTO overview = new ShowtimeOverviewDTO();

                StudioType type = studio.getStudioType();

                overview.setStudioType(type.getName());

                List<Showtime> relevantShowtimes = showtimeRepository.findByStudioIdAndMovieId(studio.getId(), request.getMovieId());

                List<ShowtimeDTO> showtimeDTOs = relevantShowtimes.stream().map(showtime -> {
                    ShowtimeDTO showtimeDTO = new ShowtimeDTO();
                    showtimeDTO.setId(showtime.getId());
                    showtimeDTO.setStartTime(showtime.getStartTime());
                    return showtimeDTO;
                }).toList();

                overview.setShowtimeDTOs(showtimeDTOs);

                Price price = priceRepository.findByTheaterAndStudioType(theater, type)
                        .orElseThrow(() -> new RuntimeException("Price not found"));

                //check holiday or not
                if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
                    overview.setPrice(price.getHolidayPrice());
                } else {
                    overview.setPrice(price.getPrice());
                }
                return overview;
            }).toList();
            response.setShowtimeOverviewDTOs(overviews);
            return response;
        }).toList();

        return ResponseEntity.status(HttpStatus.OK).body(responses);

    }
}
