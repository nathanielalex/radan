package com.example.radan_backend.dto;

import com.example.radan_backend.entity.City;
import com.example.radan_backend.entity.MovieTheaterSchedule;
import com.example.radan_backend.entity.Price;
import com.example.radan_backend.entity.Studio;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TheaterDetailDTO {
    private Integer id;
    private String name;
    private String location;

    private List<StudioTypeDetailDTO> studioTypeDetailDTOs;
}
