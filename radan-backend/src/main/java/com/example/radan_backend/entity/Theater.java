package com.example.radan_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "theater")
@EntityListeners(AuditingEntityListener.class)
public class Theater {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "location")
    private String location;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

//    @Column(name = "city_id")
//    private Integer cityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

//    @OneToMany(cascade = CascadeType.ALL)
//    @JoinColumn(name = "theater_id")
//    private List<Studio> studios;
//
//    @OneToMany(mappedBy = "theater")
//    private List<Price> prices;


    @OneToMany(mappedBy = "theater", cascade = CascadeType.ALL)
    private List<Studio> studios;

    @OneToMany(mappedBy = "theater", cascade = CascadeType.ALL)
    private List<Price> prices;

    @OneToMany(mappedBy = "theater")
    private List<MovieTheaterSchedule> movieTheaterSchedules;

}
