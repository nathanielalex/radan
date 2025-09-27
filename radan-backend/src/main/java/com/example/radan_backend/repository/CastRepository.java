package com.example.radan_backend.repository;

import com.example.radan_backend.entity.Cast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CastRepository extends JpaRepository<Cast, Integer> {
}
