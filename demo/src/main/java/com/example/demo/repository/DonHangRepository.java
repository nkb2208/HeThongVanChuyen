package com.example.demo.repository;

import com.example.demo.entity.DonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface DonHangRepository extends JpaRepository<DonHang, String> {
    List<DonHang> findByTrangThaiHienTai(String trangThai);

    List<DonHang> findByShipper_MaShipper(Integer maShipper);
}
