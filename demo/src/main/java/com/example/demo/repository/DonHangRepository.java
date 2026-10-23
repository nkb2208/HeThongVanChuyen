package com.example.demo.repository;

import com.example.demo.entity.DonHang;
import com.example.demo.entity.LichSuTrangThai;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface DonHangRepository extends JpaRepository<DonHang, String> {
    List<DonHang> findByTrangThaiHienTai(String trangThai);
}
