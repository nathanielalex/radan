package com.example.radan_backend.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class MovieRequest {
    private String title;
    private Integer duration;
    private String synopsis;
    private String director;

    private List<Integer> genreIds;
    private List<Integer> castIds;

    private MultipartFile posterImage;
}
