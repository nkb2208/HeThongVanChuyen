package com.example.demo.repository;

import com.example.demo.entity.DonHang;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface DonHangRepository extends JpaRepository<DonHang, String> {
    List<DonHang> findByTrangThaiHienTai(String trangThai);
    List<DonHang> findAllByOrderByThoiGianTaoDesc();

    // Khóa ghi bi quan (SELECT ... FOR UPDATE) để tránh race condition khi nhiều shipper cùng thao tác một đơn
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT d FROM DonHang d WHERE d.maDonHang = :maDonHang")
    Optional<DonHang> findByIdForUpdate(@Param("maDonHang") String maDonHang);
}
