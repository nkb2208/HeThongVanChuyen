package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.Shipper;

@Repository 
public interface ShipperRepository extends JpaRepository<Shipper, Integer>{
    Optional<Shipper> findByTaiKhoan_TenDangNhap(String tenDangNhap);
}