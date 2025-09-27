package com.example.radan_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "layout_seat")
@EntityListeners(AuditingEntityListener.class)
public class LayoutSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "`row_number`")
    private Integer rowNumber;

    @Column(name = "column_number")
    private Integer columnNumber;

    @Column(name = "seat_number")
    private String seatNumber;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

//    @Column(name = "studio_layout_id")
//    private Integer studioLayoutId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studio_layout_id", nullable = false)
    @JsonIgnore //usually add json ignore to many to one relations
    private StudioLayout studioLayout;

}
