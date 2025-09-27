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
import java.util.Optional;

@Service
public class GetTheaterDetailService implements Query<Integer, TheaterDetailDTO> {
    private final TheaterRepository theaterRepository;
    private final StudioRepository studioRepository;

    public GetTheaterDetailService(TheaterRepository theaterRepository, StudioRepository studioRepository) {
        this.theaterRepository = theaterRepository;
        this.studioRepository = studioRepository;
    }

    @Override
    public ResponseEntity<TheaterDetailDTO> execute(Integer id) {
        Optional<Theater> theater = theaterRepository.findById(id);
        if(theater.isPresent()) {
            TheaterDetailDTO theaterDetailDTO = new TheaterDetailDTO();
            theaterDetailDTO.setId(theater.get().getId());
            theaterDetailDTO.setName(theater.get().getName());
            theaterDetailDTO.setLocation(theater.get().getLocation());

            List<StudioTypeDetailDTO> studioTypeDetailDTOList = theater.get().getPrices().stream().map(price -> {
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
            return ResponseEntity.status(HttpStatus.OK).body(theaterDetailDTO);
        }

        //throw exception
        return null;
    }
}
