package com.example.radan_backend.repository;

import com.example.radan_backend.dto.BookingDetailDTO;
import com.example.radan_backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findAllByUserId(Integer userId);

    @Query("SELECT new com.example.radan_backend.dto.BookingDetailDTO(" +
            "st.id, m.title, t.name, st.startTime, p.price, ls.seatNumber, b.createdAt) " + // <-- Added b.createdAt
            "FROM Booking b " +
            "JOIN b.showtimeSeat ss " +
            "JOIN ss.showtime st " +
            "JOIN st.movie m " +
            "JOIN st.studio s " +
            "JOIN s.theater t " +
            "JOIN s.studioType stype " +
            "JOIN ss.layoutSeat ls " +
            "LEFT JOIN Price p ON p.studioType.id = stype.id AND p.theater.id = t.id " +
            "WHERE b.user.id = :userId " +
            "ORDER BY st.id, b.createdAt") // It's good practice to order by timestamp as well
    List<BookingDetailDTO> findBookingDetailsByUserId(@Param("userId") Integer userId);
}
