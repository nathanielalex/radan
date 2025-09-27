package com.example.radan_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "price")
@EntityListeners(AuditingEntityListener.class)
public class Price {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

//    @ManyToOne(optional = false)
//    @JoinColumn(name = "theater_id")
//    private Theater theater;

//    @ManyToOne(optional = false)
//    @JoinColumn(name = "studio_type_id")
//    private StudioType studioType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studio_type_id", nullable = false)
    private StudioType studioType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theater_id", nullable = false)
    private Theater theater;

    @Column(name = "price")
    private Float price;

    @Column(name = "holiday_price")
    private Float holidayPrice;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
