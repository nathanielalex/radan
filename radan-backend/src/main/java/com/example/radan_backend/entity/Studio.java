package com.example.radan_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "studio")
@EntityListeners(AuditingEntityListener.class)
public class Studio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

//    @Column(name = "theater_id")
//    private Integer theaterId;

    /*
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theater_id")
    private Theater theater;
     */

//    @Column(name = "studio_type_id")
//    private Integer studioTypeId;
//
//    @Column(name = "studio_layout_id")
//    private Integer studioLayoutId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theater_id", nullable = false)
    @JsonIgnore
    private Theater theater;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studio_type_id", nullable = false)
    @JsonIgnore
    private StudioType studioType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studio_layout_id", nullable = false)
    @JsonIgnore
    private StudioLayout studioLayout;

    @OneToMany(mappedBy = "studio")
    private List<Showtime> showtimes;

}
