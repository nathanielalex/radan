package com.example.radan_backend.repository;

import com.example.radan_backend.entity.Price;
import com.example.radan_backend.entity.StudioType;
import com.example.radan_backend.entity.Theater;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PriceRepository extends JpaRepository<Price, Integer> {
    Optional<Price> findByTheaterAndStudioType(Theater theater, StudioType studioType);
}
