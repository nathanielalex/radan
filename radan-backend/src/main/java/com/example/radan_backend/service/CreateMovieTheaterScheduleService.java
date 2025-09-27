package com.example.radan_backend.service;

import com.example.radan_backend.Command;
import com.example.radan_backend.dto.MovieTheaterScheduleDTO;
import com.example.radan_backend.dto.MovieTheaterScheduleRequest;
import com.example.radan_backend.dto.ShowtimeRequest;
import com.example.radan_backend.entity.*;
import com.example.radan_backend.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CreateMovieTheaterScheduleService implements Command<MovieTheaterScheduleRequest, MovieTheaterScheduleDTO> {
    private final TheaterRepository theaterRepository;
    private final ShowtimeRepository showtimeRepository;
    private final MovieTheaterScheduleRepository movieTheaterScheduleRepository;
    private final MovieRepository movieRepository;
    private final StudioRepository studioRepository;

    public CreateMovieTheaterScheduleService(TheaterRepository theaterRepository, ShowtimeRepository showtimeRepository, MovieTheaterScheduleRepository movieTheaterScheduleRepository, MovieRepository movieRepository, StudioRepository studioRepository) {
        this.theaterRepository = theaterRepository;
        this.showtimeRepository = showtimeRepository;
        this.movieTheaterScheduleRepository = movieTheaterScheduleRepository;
        this.movieRepository = movieRepository;
        this.studioRepository = studioRepository;
    }

    @Override
    public ResponseEntity<MovieTheaterScheduleDTO> execute(MovieTheaterScheduleRequest request) {
        MovieTheaterSchedule movieTheaterSchedule = new MovieTheaterSchedule();
        movieTheaterSchedule.setReleaseDate(request.getReleaseDate());
        movieTheaterSchedule.setEndDate(request.getEndDate());

        movieTheaterSchedule.setTheater(theaterRepository.findById(request.getTheaterId())
                .orElseThrow(() -> new RuntimeException("Theater not found")));
        movieTheaterSchedule.setMovie(movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found")));

        // Save the schedule first
        MovieTheaterSchedule savedSchedule = movieTheaterScheduleRepository.save(movieTheaterSchedule);

        // Now create and save showtimes related to this schedule's movie and theater
        for (ShowtimeRequest showtimeRequest : request.getShowtimes()) {
            Showtime showtime = new Showtime();
            showtime.setMovie(savedSchedule.getMovie());
            showtime.setStartTime(showtimeRequest.getStartTime());

            Studio studio = studioRepository.findById(showtimeRequest.getStudioId())
                    .orElseThrow(() -> new RuntimeException("Studio not found"));
            showtime.setStudio(studio);

            // Initialize showtimeSeats from studio layout seats
            List<ShowtimeSeat> showtimeSeats = studio.getStudioLayout().getLayoutSeats().stream().map(layoutSeat -> {
                ShowtimeSeat showtimeSeat = new ShowtimeSeat();
                showtimeSeat.setIsBooked(false);
                showtimeSeat.setLayoutSeat(layoutSeat);
                showtimeSeat.setShowtime(showtime);
                return showtimeSeat;
            }).collect(Collectors.toList());

            showtime.setShowtimeSeats(showtimeSeats);

            // Save the showtime
            showtimeRepository.save(showtime);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(new MovieTheaterScheduleDTO(savedSchedule,
                movieTheaterSchedule.getMovie().getTitle()));
    }
}
