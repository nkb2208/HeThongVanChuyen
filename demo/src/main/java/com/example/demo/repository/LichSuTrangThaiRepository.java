package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.DonHang;
import com.example.demo.entity.LichSuTrangThai;
import java.util.List;

@Repository 
public interface LichSuTrangThaiRepository extends JpaRepository<LichSuTrangThai, Integer>{
    Optional<LichSuTrangThai> findTopByDonHangOrderByThoiGianCapNhatDesc(DonHang donHang);
    List<LichSuTrangThai> findByDonHang(DonHang donHang);
}
