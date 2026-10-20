package com.example.demo.repository;

import com.example.demo.entity.Taikhoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TaiKhoanRepository extends JpaRepository<Taikhoan, Integer> {
    Optional<Taikhoan> findByTenDangNhap(String tenDangNhap);
}