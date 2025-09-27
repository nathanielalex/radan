package com.example.radan_backend.service;

import com.example.radan_backend.Query;
import com.example.radan_backend.dto.StudioTypeDetailDTO;
import com.example.radan_backend.dto.TheaterDetailDTO;
import com.example.radan_backend.entity.Studio;
import com.example.radan_backend.entity.Theater;
import com.example.radan_backend.repository.StudioRepository;
import com.example.radan_backend.repository.TheaterRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetTheatersByCityService implements Query<Integer, List<TheaterDetailDTO>> {
    private final TheaterRepository theaterRepository;
    private final StudioRepository studioRepository;

    public GetTheatersByCityService(TheaterRepository theaterRepository, StudioRepository studioRepository) {
        this.theaterRepository = theaterRepository;
        this.studioRepository = studioRepository;
    }


    @Override
    public ResponseEntity<List<TheaterDetailDTO>> execute(Integer id) {
        List<Theater> theaters = theaterRepository.findByCityId(id);
        List<TheaterDetailDTO> theaterDetailDTOList = theaters.stream().map(theater -> {
            TheaterDetailDTO theaterDetailDTO = new TheaterDetailDTO();
            theaterDetailDTO.setId(theater.getId());
            theaterDetailDTO.setName(theater.getName());
            theaterDetailDTO.setLocation(theater.getLocation());

            List<StudioTypeDetailDTO> studioTypeDetailDTOList = theater.getPrices().stream().map(price -> {
                StudioTypeDetailDTO studioTypeDetailDTO = new StudioTypeDetailDTO();
                studioTypeDetailDTO.setStudioTypeName(price.getStudioType().getName());
                studioTypeDetailDTO.setPrice(price.getPrice());
                studioTypeDetailDTO.setHolidayPrice(price.getHolidayPrice());

                List<Studio> studios = studioRepository.findAllByTheater_IdAndStudioType_Id(id, price.getStudioType().getId());

                List<String> studioNames = studios.stream().map(Studio::getName).toList();

                studioTypeDetailDTO.setStudioNames(studioNames);
                return studioTypeDetailDTO;
            }).toList();

            theaterDetailDTO.setStudioTypeDetailDTOs(studioTypeDetailDTOList);
            return theaterDetailDTO;
        }).toList();

        return ResponseEntity.status(HttpStatus.OK).body(theaterDetailDTOList);

    }
}
