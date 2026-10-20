package com.example.demo.repository;

import com.example.demo.entity.DonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonHangRepository extends JpaRepository<DonHang, String> {
    // String ở đây vì MaDonHang của bạn là kiểu String (VD: 'VD1001')
}
