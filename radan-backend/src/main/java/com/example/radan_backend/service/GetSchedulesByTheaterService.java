package com.example.radan_backend.service;

import com.example.radan_backend.Query;
import com.example.radan_backend.dto.MovieTheaterScheduleDTO;
import com.example.radan_backend.entity.MovieTheaterSchedule;
import com.example.radan_backend.repository.MovieTheaterScheduleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GetSchedulesByTheaterService implements Query<Integer, List<MovieTheaterScheduleDTO>> {
    private final MovieTheaterScheduleRepository movieTheaterScheduleRepository;

    public GetSchedulesByTheaterService(MovieTheaterScheduleRepository movieTheaterScheduleRepository) {
        this.movieTheaterScheduleRepository = movieTheaterScheduleRepository;
    }

    @Override
    public ResponseEntity<List<MovieTheaterScheduleDTO>> execute(Integer id) {
        List<MovieTheaterSchedule> movieTheaterSchedules = movieTheaterScheduleRepository.findByTheater_Id(id);
        List<MovieTheaterScheduleDTO> movieTheaterScheduleDTOs = movieTheaterSchedules.stream().map(schedule -> {
            return new MovieTheaterScheduleDTO(schedule, schedule.getMovie().getTitle());
        }).collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(movieTheaterScheduleDTOs);
    }
}
